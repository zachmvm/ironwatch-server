const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import the fs module

const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
} = require("../controllers/documentController");
const router = Router();

const DIR = "./public/images";

// Check if the directory exists, if not, create it
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
// CRUD routes for documents
router.post("/", upload.single("file"), createDocument);
router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocumentById);
router.delete("/:id", deleteDocumentById);

module.exports = router;
