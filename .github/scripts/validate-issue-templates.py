#!/usr/bin/env python3
"""
Validation script for GitHub issue templates.
This script validates the structure and content of issue templates.
"""

import os
import sys
import yaml
from pathlib import Path

def validate_yaml_frontmatter(file_path):
    """Validate YAML frontmatter in a markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not content.startswith('---'):
        return False, "Missing YAML frontmatter delimiter"
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return False, "Invalid frontmatter structure"
    
    try:
        frontmatter = yaml.safe_load(parts[1])
        
        # Check required fields
        required_fields = ['name', 'about', 'title']
        for field in required_fields:
            if field not in frontmatter:
                return False, f"Missing required field: {field}"
        
        # Validate title has a prefix
        if not frontmatter['title'].startswith('['):
            return False, "Title should start with a prefix like '[BUG]'"
        
        return True, "Valid"
    except yaml.YAMLError as e:
        return False, f"YAML parsing error: {e}"

def validate_markdown_structure(file_path):
    """Validate markdown structure."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for sections (##)
    sections = [line for line in content.split('\n') if line.startswith('## ')]
    
    if len(sections) < 3:
        return False, f"Too few sections ({len(sections)}). Expected at least 3."
    
    # Check for checklist
    if '- [ ]' not in content and '- [x]' not in content:
        return False, "No checklist found"
    
    return True, f"Valid structure with {len(sections)} sections"

def validate_template_file(file_path):
    """Validate a single template file."""
    print(f"\n{'='*60}")
    print(f"Validating: {file_path}")
    print(f"{'='*60}")
    
    # Check YAML frontmatter
    valid, message = validate_yaml_frontmatter(file_path)
    if valid:
        print(f"✅ YAML Frontmatter: {message}")
    else:
        print(f"❌ YAML Frontmatter: {message}")
        return False
    
    # Check markdown structure
    valid, message = validate_markdown_structure(file_path)
    if valid:
        print(f"✅ Markdown Structure: {message}")
    else:
        print(f"❌ Markdown Structure: {message}")
        return False
    
    print(f"✅ Template is valid!")
    return True

def validate_config_file(file_path):
    """Validate config.yml file."""
    print(f"\n{'='*60}")
    print(f"Validating: {file_path}")
    print(f"{'='*60}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        # Check blank_issues_enabled
        if 'blank_issues_enabled' not in config:
            print("⚠️  Warning: blank_issues_enabled not set")
        else:
            print(f"✅ blank_issues_enabled: {config['blank_issues_enabled']}")
        
        # Check contact_links
        if 'contact_links' in config:
            links = config['contact_links']
            print(f"✅ Contact links: {len(links)} defined")
            for link in links:
                if not all(k in link for k in ['name', 'url', 'about']):
                    print(f"❌ Invalid contact link: {link}")
                    return False
        
        print("✅ Config file is valid!")
        return True
        
    except yaml.YAMLError as e:
        print(f"❌ YAML Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main validation function."""
    template_dir = Path('.github/ISSUE_TEMPLATE')
    
    if not template_dir.exists():
        print(f"❌ Directory not found: {template_dir}")
        sys.exit(1)
    
    print("🔍 GitHub Issue Template Validator")
    print("="*60)
    
    all_valid = True
    
    # Validate config.yml
    config_file = template_dir / 'config.yml'
    if config_file.exists():
        if not validate_config_file(config_file):
            all_valid = False
    else:
        print(f"⚠️  Warning: {config_file} not found")
    
    # Validate all .md template files
    template_files = list(template_dir.glob('*.md'))
    template_files = [f for f in template_files if f.name != 'README.md']
    
    if not template_files:
        print("❌ No template files found!")
        sys.exit(1)
    
    print(f"\nFound {len(template_files)} template file(s)")
    
    for template_file in template_files:
        if not validate_template_file(template_file):
            all_valid = False
    
    # Summary
    print(f"\n{'='*60}")
    print("VALIDATION SUMMARY")
    print(f"{'='*60}")
    
    if all_valid:
        print("✅ All templates are valid!")
        sys.exit(0)
    else:
        print("❌ Some templates have errors. Please fix them.")
        sys.exit(1)

if __name__ == '__main__':
    main()
