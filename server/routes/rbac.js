const express = require("express");
const router = express.Router();
const Role = require("../models/role");
const jwt = require('jsonwebtoken');
const Permission = require("../models/permission");

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token || '';
    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        if (decoded.roleId !== 1) {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};


// POST method to create a role
router.post('/roles', verifyAdmin, async (req, res) => {
    try {

        const highestRole = await Role.findOne({}, {}, { sort: { 'roleId': -1 } });
        let roleId = highestRole && highestRole.roleId > 0 ? parseInt(highestRole.roleId) + 1 : 1;

        const { name, permissions } = req.body;
        let role = new Role({ roleId, name, permissions });
        role = await role.save();
        res.status(201).json({ success: true, message: "user created successfully", role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all roles
router.get('/roles', verifyAdmin, async (req, res) => {
    try {
        const roles = await Role.find();
        res.json({success: true, roles});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// To get a single role by ID
router.get('/roles/:roleId', verifyAdmin, async (req, res) => {
    try {
        const role = await Role.findOne({ roleId: req.params.roleId });
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// PUT method for updating role
router.put('/roles/:roleId', verifyAdmin, async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const role = await Role.findOneAndUpdate(
            { roleId: req.params.roleId },
            { name, permissions },
            { new: true }
        );
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE method for deleting a role 

router.delete('/roles/:roleId', verifyAdmin, async (req, res) => {
    try {
        const role = await Role.findOneAndDelete({ roleId: req.params.roleId });
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.status(204).json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST method for creating new permission
router.post('/permissions', verifyAdmin, async (req, res) => {
    try {

        const highestPermission = await Permission.findOne({}, {}, { sort: { 'permissionId': -1 } });
        let permissionId = highestPermission && highestPermission.permissionId > 0 ? parseInt(highestPermission.permissionId) + 1 : 1;

        const { permissionName } = req.body;
        let permission = new Permission({ permissionId, permissionName });
        permission = await permission.save();
        res.status(201).json({success: true, permission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET method to find all permissions
router.get('/permissions', verifyAdmin, async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// To get a single permission by ID
router.get('/permissions/:permissionId', verifyAdmin, async (req, res) => {
    try {
        const permission = await Permission.findOne({ permissionId: req.params.permissionId });
        if (!permission) return res.status(404).json({ message: "Permission not found" });
        res.json(permission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
