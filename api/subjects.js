const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// Updates a subject - PUT /api/subjects/:id
router.put("/:id", async (req, res, next) => {
    try {
        const updSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updSubject);
    } catch (err) { next(err) }
});

// Delete a subject - DELETE /api/subjects/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
  } catch (err) { next(err) }
})

// Creates single subject - POST /api/subjects
router.post('/', async (req, res, next) => {
    try {
        const newSubject = await Subject.create(req.body);
        res.json(newSubject);
    } catch (err) { next(err) }
});

module.exports = router;