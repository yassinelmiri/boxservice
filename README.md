# App - Application Web avec Next.js et TypeScript

![image](https://github.com/user-attachments/assets/5696fe28-c66b-4fd3-a573-eb0162007df4)

## 📌 Description
T-App est une application web développée avec Next.js et TypeScript, offrant une architecture robuste et évolutive. Elle intègre plusieurs fonctionnalités modernes telles que la gestion des données avec Axios, des hooks personnalisés, et une validation avancée des formulaires.

## Consiptions UML
le lien diagramme de cas d'utilisation :
https://app.diagrams.net/#G166jjYnhUqMOMl9k3wyxWWi4IsTCEISCu#%7B%22pageId%22%3A%22vFIk6jS-TqZyEVaIEZIl%22%7D

![deagramme de cas](https://github.com/user-attachments/assets/069436af-579e-46ad-8d40-91700bd54f4d)

diagramme de class
![image](https://github.com/user-attachments/assets/c12e6a0e-96b4-4332-9572-5bd542b4e0cc)


## 🚀 Fonctionnalités principales
- 📦 Gestion des données avec Axios
- 🗺️ Intégration de cartes interactives (Leaflet, Google Maps)
- 🔐 Authentification et gestion des utilisateurs
- 📊 Tableau de bord administrateur
- 🔄 Intégration d'API pour la communication avec le backend

## 🛠️ Technologies utilisées
### Frontend
- **Next.js** ⚛️ - Framework React pour le développement côté serveur et client
- **TypeScript** 📜 - Typage statique pour un code plus robuste
- **Axios** 🔗 - Gestion des requêtes HTTP
- **React Hooks** 🎣 - Gestion avancée de l'état et des effets
- **TailwindCSS** 🎨 - Framework CSS utilitaire
- **Framer Motion** 🎭 - Animations fluides et performantes

## 📂 Structure du projet
```
/t-app
│── app/            # Dossier principal des pages Next.js (App Router)
│── axios/          # Configuration des requêtes API
│── components/     # Composants réutilisables
│── Hooks/          # Hooks personnalisés
│── public/         # Fichiers statiques (images, icônes...)
│── types/          # Définitions des types TypeScript
│── validation/     # Schémas de validation des formulaires
│── package.json    # Dépendances et scripts
```

## ⚡ Installation et exécution
### 1️⃣ Cloner le dépôt
```sh
git clone https://github.com/votre-utilisateur/t-app.git
cd t-app
```

### 2️⃣ Installer les dépendances
```sh
npm install
```

### 3️⃣ Démarrer le serveur de développement
```sh
npm run dev
```
L'application sera accessible sur `http://localhost:3000/`.

## 📡 Connexion avec le Backend
Assurez-vous que l'API backend est en cours d'exécution et configurée correctement.
Modifiez la configuration dans `axios/api.ts` si nécessaire.

## 🔗 API Endpoints (Exemples)
- `GET /users` - Récupère la liste des utilisateurs
- `POST /auth/login` - Authentification utilisateur
- `POST /reservations` - Crée une nouvelle réservation

## 🤝 Contribution
Les contributions sont les bienvenues ! Pour contribuer :
1. Forker le dépôt
2. Créer une branche (`git checkout -b feature-nouvelle-fonctionnalité`)
3. Apporter vos modifications et commit (`git commit -m "Ajout d'une nouvelle fonctionnalité"`)
4. Pousser la branche (`git push origin feature-nouvelle-fonctionnalité`)
5. Créer une Pull Request 🚀

## 📄 Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteurs
- **Yassine Elmiri** - Développeur Frontend (Next.js, TypeScript)
- **Marouane Fagri** - Développeur Backend
- **El Hamra Mohammed** - Encadrement

