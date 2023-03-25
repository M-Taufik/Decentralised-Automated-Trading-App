const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(cors());

app.post('/run-python-script', (req, res) => {


  // Get the absolute path of the current directory
  const currentDir = path.dirname(__filename);
  // Specify the location of the Python script
  const pythonScript = path.join(currentDir, 'analysis.py');
  console.log("Python Script Path: " + pythonScript);

  const inputData = req.body;
  const inputObj = JSON.stringify(inputData);
  console.log("Input Value Obj" + inputObj)
  const finalobj = JSON.parse(inputObj)
  const firstpairValue = finalobj.inputTrade.firstpair;
  const secondpairValue = finalobj.inputTrade.secondpair;
  const Value = finalobj.inputTrade.input;
  console.log("TRADED VALUE" + " " + firstpairValue + " " + secondpairValue + " " + Value)
  const pythonProcess = spawn('python', [pythonScript, firstpairValue, secondpairValue,Value]);

  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log("outputdata" + output)
    res.setHeader('Content-Type', 'application/json');
    res.send({ output });
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Internal Server Error');
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
