use actix_cors::Cors;
use pulldown_cmark::{Parser , Options};
use std::fs::{self, File};
use std::io::{Write};
use std::path::{Path , PathBuf};
use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use actix_files::NamedFile;
use serde::{Serialize , Deserialize};

#[derive(Debug, Serialize , Deserialize)]
struct Input {
    mdstring : String,
}


fn md_to_html(markdown_input: String) -> String {
    // let markdown_input = "Hello world, this is a ~~complicated~~ *very simple* example.";

    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);

    let parser = Parser::new_ext(&markdown_input, options);

    let mut html_output = String::new();
    pulldown_cmark::html::push_html(&mut html_output, parser);

    println!("{}", html_output);
    html_output
}

    // let path = Path::new("markdown.md");
    // let contents = fs::read_to_string(path).unwrap();
    // println!("{}" , contents);

    
#[post("/tohtmlstrings")]
async fn convert_to_html_string(data : web::Json<Input>) -> impl Responder{
    let html_output = md_to_html(data.mdstring.to_owned());
    HttpResponse::Ok().json(html_output)
}
   
#[post("/")]
async fn convert_to_html(body : web::Bytes , req: actix_web::HttpRequest) -> Result<HttpResponse, std::io::Error>{
    let contents = String::from_utf8_lossy(&body);
     let html = md_to_html(contents.into_owned());
    
    let path = Path::new("parsed.html");

    let mut file = match File::create(path) {
        Ok(file) => file,
        Err(e) => panic!("error {}" , e)
    };

    match file.write_all(html.as_bytes()) {
        Ok(_) => println!("successfully created file"),
        Err(e) => panic!("Error {}", e)
    }
 
    let pathbuf : PathBuf = "./parsed.html".parse().unwrap();
    return Ok(NamedFile::open(pathbuf)?.into_response(&req));
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    
    HttpServer::new(move ||{
            let cors = Cors::default()
                                    .allow_any_origin()
                                    .allow_any_method()
                                    .allow_any_header();
            App::new()
                .wrap(cors)
                .service(convert_to_html)  
                .service(convert_to_html_string) 
        }
    )
    .bind(("127.0.0.1" , 8080))?
    .run()
    .await

}
