const express = require("express");
const { Employee, Department } = require("../models/api.model");
const { hashMake, hashCheck } = require("../utils/hash");
const { createAccessToken } = require("../utils/jwt");
const apiMiddleware = require("../middlewares/api.middleware");
const router = express.Router();

router.get("/employees/list", apiMiddleware ,async (req, res) => {
  try {
    console.log("Check");
    const employees = await Employee.find()
      .populate("department")
      .populate("manager");
    const newEmp = employees.map((emp) => ({
      fullName: emp.fullName,
      dob: emp.dateOfBirth,
      gender: emp.gender,
      email: emp.account.email,
      department: emp.department.name,
      manager: emp.manager ? `${emp?.manager?.name?.firstName} ${emp?.manager?.name.middleName} ${emp?.manager?.name.lastName}` : null,
      depentdents: emp.dependents.map((de) => ({
        name: de.fullname,
        relation: de.relation,
      })),
    }));
    return res.json(newEmp);
  } catch (error) {
    // errors[fd]
    return res.status(500).json(error);
  }
});

// getDepartmentId
router.get("/departments/:departmentId", async (req, res) => {
    try {
        const {departmentId} = req.params;
        const employees = await Employee.find({department: departmentId}).populate("department").populate("manager");
        const filterEmp = employees.filter(emp => emp.manager);
        const newDepart = {
            department: filterEmp[0].department.name,
            manager: filterEmp[0]?.manager.fullName,
            employees: filterEmp.map(emp => ({
                id: emp._id,
                fullName: emp.fullName
            }))
        }
        return res.json(newDepart)
    } catch (error) {
        
    }
});

router.post("/departments/create", async (req, res) => {
    try {
        const {name, description, employees} = req.body;
        if(!name.trim()){
            return res.status(400).json({
                error: {
                    status: 400,
                    message: "Department name is required",
                }
            })
        };
        const existDepart = await Department.findOne({name: name});
        if(existDepart){
            return res.status(400).json({
                error: {
                    status: 400,
                    message: "Department 'Customer Service' already exists.",
                }
            })
        }
        if(!employees.name.firstName || !employees.name.lastName){
            return res.status(400).json({
                error: {
                    status: 400,
                    message: "Phai co name.",
                }
            })
        }
        const department = await Department.create({name, description});
        // for lặp qua từng emp => create từng cái thì nó sẽ áp đụng được asyn await 
        // insertMany 
        // promise => promiseAll => xử lý vấn đề bất đồng bộ => khi xử lý nhiều data cùng lúc

        await Employee.insertMany(
            await Promise.all(employees?.map( async (emp) => {
                return {
                    ...emp,
                    department: department._id,
                    account: {
                        email: emp?.account?.email,
                        password: await hashMake(emp?.account?.password),
                    }
                }
            }))
        );
        return res.json({
            departmentId: department._id,
            departmentName: name,
            employeesList: employees.map(emp => ({
                name:  `${emp.name.firstName} ${emp.name.middleName} ${emp.name.lastName}`
            }))
        });
    } catch (error) {
        return res.json({
            error
        });
        
    }
});

router.post("/auth/login", async ( req, res) => {
    try {
        const {email, password} = req.body;
        // account chuwsa email + password nhung no la 1 object
        const employee = await Employee.findOne({ "account.email": email });
        console.log(employee);
        
        if(!employee){
            return res.status(400).json({
                error: {
                    status: 400,
                    message: "not found",
                }
            })
        }
        const passwordCheck = employee?.account?.password;
        const status = await hashCheck(password, passwordCheck);
        console.log(status);
        
        // michael.doe@example.com
        // Secure@123
        if(!status){
            return res.status(400).json({
                error: {
                    status: 400,
                    message: "not found",
                }
            })
        }
        // tao token 
        const token = await createAccessToken({
            id: employee._id
        })
        return res.json({
            message: "Login successfully!",
            token: token,
        })
    } catch (error) {
        
    }
})

router.get("/dashboard", apiMiddleware ,async (req, res) => {
    try {
       const id = req.id;
        const employee = await Employee.findById(id).populate("department");

        return res.json({
            message: "Welcome to the Dashboard!", 
            user: {
                id: id,
                email: employee?.account?.email,
                department: employee?.department?.name
            }
        })
    } catch (error) {
        
    }
})
module.exports = router;
