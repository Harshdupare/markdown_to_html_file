use pulldown_cmark::{Parser , Options};
use std::fs::{self, File};
use std::io::{Write};
use std::path::Path;



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

fn main() {
    
    let path = Path::new("markdown.md");
    let contents = fs::read_to_string(path).unwrap();
    println!("{}" , contents);
    
    let html = md_to_html(contents);
    
    let path = Path::new("parsed.html");

    let mut file = match File::create(path) {
        Ok(file) => file,
        Err(e) => panic!("error {}" , e)
    };

    match file.write(html.as_bytes()) {
        Ok(_) => println!("successfully created file"),
        Err(e) => panic!("Error {}", e)
    }

}
