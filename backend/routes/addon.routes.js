const express = require('express');
const router = express.Router();
const addonController = require('../controllers/addon.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', addonController.getAddons);

router.get('/:id', addonController.getAddonById);

router.post(
    '/',
    authenticate,
    isAdmin,
    addonController.addAddon
);

router.put(
    '/:id',
    authenticate,
    isAdmin,
    addonController.updateAddon
);

router.delete('/:id', authenticate, isAdmin, addonController.deleteAddon);

module.exports = router;
