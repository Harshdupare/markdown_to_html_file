"use client"
import Image from "next/image";
import download from "@/public/E252.svg";
import {useState , useEffect} from "react";
import axios from "axios";



export default function Home() {

  const [file , setFile] = useState<any>();
  const [mdString , setMdString] = useState<string>();
  const [htmlString , setHtmlString] = useState<string>();
  const [loading , setLoading] = useState<boolean>(true);

  async function downloadHtmlFile() {

    const blob = new Blob([htmlString as string], {type : "text/html"});
    const url = URL.createObjectURL(blob);
    console.log(blob);
    const a = document.createElement('a');
    a.href = url
    a.download = "parsed.html"
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  })

  return (
    <>  
      {loading ?
        <div
          className="bg-[url(https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3drdWE1azVjZHc1eDJzcHAxY2tmaWEzaDdtanZkaDZyOG45NHVxciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2SpPmCmmCmiS8sWA/giphy.gif)] 
           bg-auto bg-no-repeat bg-center
           w-96 h-96   bg-origin-border
           grid justify-center 
           rounded-4xl relative left-2/5 top-20 bg-blend-lighten bg-black"
        >
          <h1 className="relative top-96 text-white font-bold text-3xl">Loading....</h1>
        </div>

        :
        <div className="grid justify-center relative top-24 bg-black">
          <h1 className="grid text-4xl font-bold m-2 justify-center text-white" >Mardown to HTML</h1>
          <div className="flex bg-white">
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
              <div className="m-2 border bord,er-black p-2">
                <h2 className="m-2 mb-3 text-3xl font-bold">HTML file output : </h2>
                {(htmlString != null) ?  
                  <>  
                    <iframe srcDoc={htmlString} className="m-3 text-xl font-bold border border-black w-96 h-72"></iframe> 
                  </>
                  : 
                  <div className="border border-black w-96 h-72 "></div>
                }
                <p className="m-2 text-3xl font-bold">OR</p>     
                <button className="flex border border-black m-1 bg-black text-white rounded-xl p-2 " onClick={downloadHtmlFile}>
                  <p className="m-0.5">Download</p>
                  <Image src={download} alt="--> Download icon" className="h-5 w-5 text-black font-extrabold rounded-2xl m-0.5 bg-white"/>
                </button>
              </div>
          </div>
        </div>

      }
    </>
  );
}
 