const addonRepo = require('../repositories/addon.repository');
require('dotenv').config();

exports.addAddon = async (data) => {

    const existing = await addonRepo.getAllAddons();
    if (existing.some(c => c.name.toLowerCase() === data.name.toLowerCase())) {
        throw new Error('Addon name already exists');
    }

    return await addonRepo.createAddon(data);
};

exports.getAddons = async () => {
    return await addonRepo.getAllAddons();
};

exports.getAddonById = async (id) => {
    const addon = await addonRepo.getAddonById(id);
    if (!addon) {
        throw new Error('Addon not found');
    }
    return addon;
}

exports.updateAddon = async (id, data) => {
    const existing = await addonRepo.getAddonById(id);
    if (!existing) {
        throw new Error('Addon not found');
    }

    return await addonRepo.updateAddonById(id, data);
};

exports.deleteAddon = async (id) => {
    const existing = await addonRepo.getAddonById(id);
    if (!existing) {
        throw new Error('Addon not found');
    }

    return await addonRepo.deleteAddonById(id);
};
