import express from 'express';
import multer from 'multer';
import { createWorker } from 'tesseract.js';

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.status(200).json({ message: "system working ok. 0.0.1" });
});

app.post("/upload", upload.single('image'), async (req, res) => {
  try {
    console.log("file uploaded: ", req.file);
    
    const worker = await createWorker('eng'); 
    const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    //const ret = await worker.recognize(req.file.buffer);

    res.status(200).json({ message: ret.data.text });  
    await worker.terminate();
  } catch (error) {
    res.status(418).json({ error: error.message });  
  }
});

app.listen(process.env.API_PORT, () => console.log(`Server ready on port ${process.env.API_PORT}.`));


