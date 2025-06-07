const addonService = require('../services/addon.service');
const { addAddonDto, updateAddonDto } = require('../dtos/addon.dto');

exports.addAddon = async (req, res) => {
    try {
        const { error } = addAddonDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const addon = await addonService.addAddon(req.body, req.file);
        return res.status(201).json({ message: 'Addon added successfully', addon });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getAddons = async (req, res) => {
    try {
        const addons = await addonService.getAddons();
        if (addons.length === 0) {
            return res.status(200).json({ message: 'No addons found', addons: [] });
        }
        return res.status(200).json(addons);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.getAddonById = async (req, res) => {
    try {
        const addon = await addonService.getAddonById(req.params.id);
        if (!addon) {
            return res.status(404).json({ message: 'Addon not found' });
        }
        return res.status(200).json(addon);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
}

exports.updateAddon = async (req, res) => {
    try {
        const { error } = updateAddonDto.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const updated = await addonService.updateAddon(req.params.id, req.body, req.file);
        return res.status(200).json({ message: 'Addon updated', addon: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};

exports.deleteAddon = async (req, res) => {
    try {
        await addonService.deleteAddon(req.params.id);
        return res.status(200).json({ message: 'Addon deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
};
