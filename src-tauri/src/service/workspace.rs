use std::{fs, path::{Path, PathBuf}};

use tauri::command;

fn get_config_path(path: &str) -> PathBuf {
    let path = Path::new(path);
    path.join(".pt")
}

#[command]
pub fn init_workspace(path: &str) -> Result<(), String> {
    let config_path = get_config_path(path);
    if !config_path.exists() {
        std::fs::create_dir_all(config_path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct PdfInfo {
    pub name: String,
    pub path: String,
}

#[command]
pub fn get_pdf_list(path: &str) -> Vec<PdfInfo> {
    let mut pdf_list: Vec<PdfInfo> = Vec::new();

    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("pdf") {
                    if let Some(file_name) = path.file_name().and_then(|s| s.to_str()) {
                        pdf_list.push(PdfInfo {
                            name: file_name.to_string(),
                            path: path.to_string_lossy().to_string(),
                        });
                    }
                }
            }
        }
    }

    pdf_list
}

#[command]
pub fn init_highlight_dir(path: &str) {
    let highlight_dir = get_config_path(path);
}