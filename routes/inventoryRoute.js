const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const inventoryController = require('../controllers/inventoryController');
const invValidate = require('../utilities/inventory-validation');

router.get('/', utilities.handleErrors(inventoryController.buildManagement));
router.get('/add-classification', utilities.handleErrors(inventoryController.buildAddClassification));
router.post(
  '/add-classification',
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(inventoryController.addClassification)
);

router.get('/add-inventory', utilities.handleErrors(inventoryController.buildAddInventory));
router.post(
  '/add-inventory',
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(inventoryController.addInventory)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(inventoryController.getInventoryJSON));
/* ***************************
 * Route to build inventory by classification
 * ************************** */
router.get("/type/:classification_id", utilities.handleErrors(inventoryController.buildByClassificationId));

/* ***************************
 * Route to build inventory edit view
 * ************************** */
router.get("/edit/:inv_id", utilities.handleErrors(inventoryController.editInventoryView));

/* ***************************
 * Route to handle inventory update
 * ************************** */
router.post("/update/", [
  invValidate.inventoryRules(), 
  invValidate.checkUpdateData,
], utilities.handleErrors(inventoryController.updateInventory));

router.get('/delete/:inv_id', async (req, res, next) => {
  try {
    const { inv_id } = req.params;
    await inventoryController.buildDeleteConfirm(req, res, next);
  } catch (error) {
    next(error); 
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    await inventoryController.executeDelete(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router;