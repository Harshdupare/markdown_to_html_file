"use client"
import Image from "next/image";
import download from "@/public/E252.svg";
import {useState , useEffect} from "react";
import axios from "axios";



export default function Home() {

  const [file , setFile] = useState<any>();
  const [mdString , setMdString] = useState<String>();
  const [htmlString , setHtmlString] = useState<String>();

  async function sendMdString(){
    try{
      const result = await axios.post("http://localhost:8080/tohtmlstrings",{
        mdstring : mdString
      }, {
        headers : {
          "Content-Type" : "application/json"
        }
      })
      
      setHtmlString(result.data);

    }catch(e){
      console.log(e);
    }
  }

  async function sendMarkdownFile(){
    try {
      let formData = new FormData();
      formData.append("file", file);
      
      let result = await axios.post("http://localhost:8080", file ,{
        responseType : "blob"
      })
      const blob = new Blob([result.data] , {type : "text/html"});
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data.html"
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }catch(e){
      console.log("error :" , e);
    }
    
  }

  return (
    <div className="grid justify-center relative top-24">
      <h1 className="grid text-4xl font-bold m-2 justify-center" >Mardown to HTML</h1>
      <div className="flex">
          <div className="m-2 border border-black p-2">
            <h2 className="m-2 text-3xl font-bold">Upload the Markdown file : </h2>
            <textarea className="m-2 text-xl font-bold border border-black w-96 h-72" placeholder="# Enter your markdown statements" onChange={(e) => {
              setMdString(e.target.value)
            }}/> <br/>
            <button className="border border-black m-1 bg-black text-white rounded-xl p-2 " onClick={sendMdString}>Convert</button>
            <p className="m-2 text-3xl font-bold">OR</p>

            <div>
              <input type="file" className="text-lg border border-black rounded-sm font-medium m-2 p-1" onChange={(e) => {
                if(e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0])
                }
              }}></input>
              <button className="border border-black m-1 bg-black text-white rounded-xl p-2 " onClick={sendMarkdownFile}>Convert</button>
            </div>
            
          </div>
          <div className="m-2 border border-black p-2">
            <h2 className="m-2 text-3xl font-bold">HTML file output : </h2>
            {/* <iframe src="" className="m-2 text-xl font-bold border border-black w-96 h-72"></iframe>  */}
            <>
              {(htmlString && htmlString?.length > 0) ?  
                <>  
                {htmlString}
                </>
                : 
                <></>
              }
            </>
            <p className="m-2 text-3xl font-bold">OR</p>     
            <button className="flex border border-black m-1 bg-black text-white rounded-xl p-2 ">
              <p className="m-0.5">Download</p>
              <Image src={download} alt="--> Download icon" className="h-5 w-5 text-black font-extrabold rounded-2xl m-0.5 bg-white"/>
            </button>
          </div>
      </div>
    </div>
  );
}
 