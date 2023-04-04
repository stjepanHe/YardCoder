import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {

    id:string,
    content:string,
    type:'text' | 'code';
}
interface LocalApiError {
    code: string;
  }

export const createCellsRouter = (filename:string, dir:string) => {



const router = express.Router();
router.use(express.json());

const fullPath = path.join(dir, filename);

router.get('/cells', async(req, res)=> {

    //make sure the cell storage file exist
    //if it does not exist, add in a default lost of cells
    try {
        const result = await fs.readFile(fullPath, {encoding:'utf-8'});

        res.send(JSON.parse(result));
}catch(err){

            if(err.code === 'ENOENT'){
              await fs.writeFile(fullPath, '[]', 'utf-8')  // Add code to create a file and add default cells
              res.send([]);
            }
            else {
                throw err;
            }
}
    //Read the file
    //Parse a list of cells out of it
    //Send list of cells back to browsver

})


router.post('/cells', async(req, res)=> {
   

        //Make sure the file exists
        // if not, create it 
        //Take the list of cells from the request obj

        const {cells}: {cells: Cell[]} = req.body;
        //serialize them 
        // Write the cells into the file 

        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

        res.send({status:'ok'});

})


return router;
}