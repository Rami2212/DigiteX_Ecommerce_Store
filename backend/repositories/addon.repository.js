const Addon = require('../models/addon.model');

exports.createAddon = async (data) => await Addon.create(data);

exports.getAllAddons = async () => await Addon.find();

exports.getAddonById = async (id) => await Addon.findById(id);

exports.updateAddonById = async (id, data) => await Addon.findByIdAndUpdate(id, data, { new: true });

exports.deleteAddonById = async (id) => await Addon.findByIdAndDelete(id);
