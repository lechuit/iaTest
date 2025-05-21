// mpc-context-service/src/controllers/contextController.js
const contextStorageService = require('../services/contextStorageService');

exports.logContext = async (req, res, next) => {
    try {
        // TODO: Validate req.body
        const { changeDetails, contextData } = req.body;
        const result = await contextStorageService.saveContext(changeDetails, contextData);
        res.status(201).json({ message: 'Context logged successfully', data: result });
    } catch (error) {
        // TODO: More specific error handling
        next(error);
    }
};

exports.getContextHistory = async (req, res, next) => {
    try {
        // TODO: Validate req.params
        const { sheetId } = req.params;
        const history = await contextStorageService.retrieveContextHistory(sheetId);
        if (!history || history.length === 0) {
            return res.status(404).json({ message: 'No context history found for this sheet ID.' });
        }
        res.status(200).json({ data: history });
    } catch (error) {
        // TODO: More specific error handling
        next(error);
    }
};
