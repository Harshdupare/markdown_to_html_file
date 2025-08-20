import * as fs from "node:fs";

const ConvertToHtmlFiles = async (htmlString : String) =>{
    const data = new Uint8Array(Buffer.from(htmlString as any))
      const htmlfile = fs.writeFile("web-ui/public/parsedhtml.html", data , (err) =>{
        console.log("Error while writing into the file " ,err);
      })
} 



export { ConvertToHtmlFiles };