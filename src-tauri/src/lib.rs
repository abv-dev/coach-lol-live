use serde_json::Value;
use tauri::Manager;

#[tauri::command]
async fn fetch_live_game_data() -> Result<Value, String> {
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .timeout(std::time::Duration::from_millis(1500))
        .build()
        .map_err(|e| format!("client build: {e}"))?;

    let res = client
        .get("https://127.0.0.1:2999/liveclientdata/allgamedata")
        .send()
        .await
        .map_err(|e| format!("fetch: {e}"))?;

    if res.status() == reqwest::StatusCode::NOT_FOUND {
        return Err("NO_GAME".to_string());
    }

    if !res.status().is_success() {
        return Err(format!("HTTP {}", res.status()));
    }

    res.json::<Value>().await.map_err(|e| format!("parse: {e}"))
}

#[tauri::command]
fn set_overlay_visible(app: tauri::AppHandle, visible: bool) -> Result<(), String> {
    if let Some(overlay) = app.get_webview_window("overlay") {
        if visible {
            overlay.show().map_err(|e| format!("show: {e}"))?;
            overlay.set_always_on_top(true).map_err(|e| format!("aot: {e}"))?;
        } else {
            overlay.hide().map_err(|e| format!("hide: {e}"))?;
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![fetch_live_game_data, set_overlay_visible])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
