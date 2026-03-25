#!/usr/bin/env python3
"""
Translation Manager for next-intl.

Manages translations in:
- src/core/locales/         (global translations)
- src/modules/[module]/locales/  (module-specific translations)

Usage:
  python manage_translations.py <global|module_name> <key> <value_en> [value_es]

Examples:
  # Global translation
  python manage_translations.py global common.save "Save" "Guardar"

  # Module translation (e.g., auth module)
  python manage_translations.py auth signIn.title "Sign In" "Iniciar Sesión"
"""
import sys
import json
from pathlib import Path

# Config
CORE_LOCALES = Path("src/core/locales")
MODULES_ROOT = Path("src/modules")

def load_json(path):
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        print(f"[ERROR] Failed to decode JSON: {path}")
        return {}

def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')

def set_nested(data, key_path, value):
    """Set a nested key in a dictionary using dot notation."""
    keys = key_path.split('.')
    current = data
    for i, key in enumerate(keys[:-1]):
        if key not in current:
            current[key] = {}
        current = current[key]
        if not isinstance(current, dict):
            print(f"[ERROR] Key collision at {'.'.join(keys[:i+1])}")
            return False
    current[keys[-1]] = value
    return True

def add_translation(namespace, key, value_en, value_es=None):
    """Add a translation to the specified namespace."""
    if not value_es:
        value_es = f"[TODO] {value_en}"

    # Determine the locales directory
    if namespace == "global":
        locales_dir = CORE_LOCALES
        print(f">> Adding global translation...")
    else:
        locales_dir = MODULES_ROOT / namespace / "locales"
        print(f">> Adding translation to module '{namespace}'...")

    # Update EN
    en_path = locales_dir / "en.json"
    en_data = load_json(en_path)
    if set_nested(en_data, key, value_en):
        save_json(en_path, en_data)
        print(f"[OK] Added to {en_path}: {key} = {value_en}")

    # Update ES
    es_path = locales_dir / "es.json"
    es_data = load_json(es_path)
    if set_nested(es_data, key, value_es):
        save_json(es_path, es_data)
        print(f"[OK] Added to {es_path}: {key} = {value_es}")

def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)

    namespace = sys.argv[1]
    key = sys.argv[2]
    value_en = sys.argv[3]
    value_es = sys.argv[4] if len(sys.argv) > 4 else None

    add_translation(namespace, key, value_en, value_es)

if __name__ == "__main__":
    main()
