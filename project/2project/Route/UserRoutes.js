const express = require('express');
const UserControl = require('../Controller/UserControl');

const router = express.Router();

router.get('/', UserControl.getAllUsers);
router.get('/:id', UserControl.getUserById);
router.post('/', UserControl.createUser);
router.put('/:id', UserControl.updateUser);
router.delete('/:id', UserControl.deleteUser);

module.exports = router;