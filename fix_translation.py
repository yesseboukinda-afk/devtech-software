from pathlib import Path
replacements = {
    'My Dashboard': 'Mon tableau de bord',
    'Go Back To Home': "Retour à l'accueil",
    'Seller Login': 'Connexion vendeur',
    'Log Out': 'Se déconnecter',
    'English': 'Anglais',
    'Turkish': 'Turc',
    'Spanol': 'Espagnol',
    'Italiano': 'Italien',
    'Home': 'Accueil',
    'Help - Electro': 'Aide - Red_link Shop',
    'Notifications - Electro': 'Notifications - Red_link Shop',
    'Wishlist - Electro': 'Liste de souhaits - Red_link Shop',
    'Support - Electro': 'Support - Red_link Shop',
}
repls = sorted(replacements.items(), key=lambda item: -len(item[0]))
root = Path('.')
changed_files = []
for path in sorted(root.glob('*.html')):
    text = path.read_text(encoding='utf-8', errors='ignore')
    original = text
    for old, new in repls:
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding='utf-8')
        changed_files.append(path.name)
print('changed files:', changed_files)
