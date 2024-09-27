import UserService from "../services/UserService.js";
import catcher from "../utils/catcher.js";

const UserController = {
    listCustomers: catcher(async (req, res) => {
    const customers = await UserService.getUsers('customer');
        return res.json({ data: customers });
    }),
    listEmployees: catcher(async (req, res) => {
        const employees = await UserService.getUsers('employee');
        return res.json({ data: employees });
    }),
    listInstructors: catcher(async (req, res) => {
        const instructors = await UserService.getUsers('instructor');
        return res.json({ data: instructors });
    }),
    getUser: catcher(async (req, res) => {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ data: user });
    }),
    updateCustomer: catcher(async (req, res) => {
        const { id } = req.params;
        const customer = await UserService.getUserById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        const { name, externalId, centerId, groupId, locationId } = req.body;
        const updatedCustomer = await UserService.updateUser(id, { name, externalId, centerId, groupId, locationId });
        return res.json({ message: 'Customer updated successfully'});
    }),
    updateEmployee: catcher(async (req, res) => {
        const { id } = req.params;
        const employee = await UserService.getUserById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const { name, externalId, departmentId, designationId, branchId } = req.body;
        const updatedEmployee = await UserService.updateUser(id, { name, externalId, departmentId, designationId, branchId });
        return res.json({ message: 'Employee updated successfully'});
    }),
    updateInstructor: catcher(async (req, res) => {
        const { id } = req.params;
        const instructor = await UserService.getUserById(id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        const { name } = req.body;
        const updatedInstructor = await UserService.updateUser(id, { name });
        return res.json({ message: 'Instructor updated successfully'});
    }),
    deActivateUser: catcher(async (req, res) => {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await UserService.updateUser(id, { isActive: false });
        return res.json({ message: 'User deactivated successfully'});
    }),
}

export default UserController;