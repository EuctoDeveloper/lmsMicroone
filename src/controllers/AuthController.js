import catcher from "../utils/catcher.js";
import User from "../models/UserModel.js";
import jwt from "../utils/jwt.js";
import UserService from "../services/UserService.js";
import logger from "../configs/loggers.js";

const Authcontroller = {
    clientLogin: catcher(async (req, res) => {
        const { email, password } = req.body;
        const user = await UserService.getUser(email, ['customer', 'employee']);
        if (!user) {
            return res.status(401).json({ message: 'Invalid User' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const userData = {
            email: user.email,
            role: user.role,
            name: user.name,
            isActive: user.isActive
        };

        const {accessToken, refreshToken} = await UserService.getTokens({...userData, userId: user.userId});

        return res.json({ message: 'Login successful', data: {accessToken, refreshToken, userData} });
    }),
    adminLogin: catcher(async (req, res) => {
        const { email, password } = req.body;
        const user = await UserService.getUser(email, ['admin', 'instructor']);
        if (!user) {
            return res.status(401).json({ message: 'Invalid User' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const userData = {
            email: user.email,
            role: user.role,
            name: user.name,
            isActive: user.isActive
        };

        const {accessToken, refreshToken} =  await UserService.getTokens({...userData, userId: user.userId});


        return res.json({ message: 'Login successful', data: {accessToken, refreshToken, userData} });
    }),
    addCustomer: catcher(async (req, res) => {
        const { email, password, name, externalId, centerId, groupId, locationId } = req.body;

        const existingUser = await UserService.getUser(email, ['customer', 'employee', 'admin', 'instructor']);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ email, password, role:"customer", name, externalId, centerId, groupId, locationId });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    }),
    addEmployee: catcher(async (req, res) => {
        const { email, password, name, externalId, departmentId, designationId, branchId } = req.body;

        const existingUser = await UserService.getUser(email, ['customer', 'employee', 'admin', 'instructor']);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ email, name, password, role: "employee", externalId, departmentId, designationId, branchId });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    }),
    addInstructor: catcher(async (req, res) => {
        const { email, password, name } = req.body;

        const existingUser = await UserService.getUser(email, ['customer', 'employee', 'admin', 'instructor']);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ email, password, role:"instructor", name });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully'})
    }),
    refreshToken: catcher(async (req, res) => {
        const oldRefreshToken = req.headers['refresh-token'];
        const decodedToken = jwt.decodeToken(oldRefreshToken);
        if (!decodedToken || decodedToken.token !== 'refresh_token') {
            logger.error('Invalid Refresh Token');
            return res.status(401).json({ message: 'Invalid Request' });
        }
        const user = await UserService.getUser(decodedToken.user.email, ['customer', 'employee', 'admin', 'instructor']);
        if (!user) {
            logger.error('Invalid User');
            return res.status(401).json({ message: 'Invalid Request' });
        }
        const isRefreshTokenValid = user.refreshTokens.includes(oldRefreshToken);
        if (!isRefreshTokenValid) {
            logger.error('Invalid Refresh Token');
            return res.status(401).json({ message: 'Invalid Request' });
        }
        user.refreshTokens = user.refreshTokens.filter(token => token !== oldRefreshToken);
        await user.save();

        const userData = {
            email: user.email,
            role: user.role,
            name: user.name,
            isActive: user.isActive
        };

        const {accessToken, refreshToken} =  await UserService.getTokens({...userData, userId: user.userId});

        return res.json({ message: 'Refresh token verified successfully', data: {accessToken, refreshToken, userData} });
    }),
    fetchUserFromRequset: catcher(async (req, res, next) => {
        const { userId } = req.user;
        const user = await User.findOne({userId});

        if (!user) {
            return res.status(401).json({ message: 'Invalid User' });
        }
        else if(!user.isActive){
            return res.status(401).json({ message: 'User is not active' });
        }
        else {
            return res.json({ message: 'User fetched', status: "success", user });
        }
    }),

}

export default Authcontroller;