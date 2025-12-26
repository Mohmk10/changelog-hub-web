# Changelog Hub Web

[![Angular](https://img.shields.io/badge/Angular-20-dd0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-ff6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)

> **Web Dashboard for API Breaking Change Detection** — Interactive UI for visualizing API changes, analytics, and changelog history.

![Dashboard Screenshot](docs/screenshots/dashboard.png)

---

## Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview with stats, quick actions, and recent comparisons |
| **Compare** | Drag & drop file upload for API spec comparison |
| **Changelog** | Searchable history with severity filters |
| **Analytics** | Charts and metrics for API stability trends |
| **Settings** | Theme toggle, detection rules, data management |
| **Light/Dark Mode** | System preference detection + manual toggle |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Angular 20 |
| **Language** | TypeScript 5.6 |
| **Styling** | TailwindCSS 3.4 |
| **Charts** | Chart.js 4.4 + ng2-charts |
| **Icons** | Lucide Angular |
| **Build** | Angular CLI |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Mohmk10/changelog-hub-web.git
cd changelog-hub-web

# Install dependencies
npm install

# Start development server
npm start
```

Open http://localhost:4200 in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── core/                    # Services & Models
│   │   ├── models/
│   │   │   └── breaking-change.model.ts
│   │   └── services/
│   │       ├── changelog.service.ts
│   │       └── theme.service.ts
│   ├── shared/                  # Reusable Components
│   │   └── components/
│   │       ├── sidebar/
│   │       ├── severity-badge/
│   │       └── theme-toggle/
│   ├── features/                # Page Components
│   │   ├── dashboard/
│   │   ├── compare/
│   │   ├── changelog/
│   │   ├── analytics/
│   │   └── settings/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.css                   # Global styles + Tailwind
└── index.html
```

---

## Screenshots

### Dashboard (Dark Mode)
![Dashboard Dark](docs/screenshots/dashboard-dark.png)

### Dashboard (Light Mode)
![Dashboard Light](docs/screenshots/dashboard-light.png)

### Compare Page
![Compare](docs/screenshots/compare.png)

### Analytics
![Analytics](docs/screenshots/analytics.png)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run watch` | Build with watch mode |
| `npm test` | Run unit tests |

---

## Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **Changelog Hub** | Backend Java API | [GitHub](https://github.com/Mohmk10/changelog-hub) |
| **Maven Central** | Java libraries | `io.github.mohmk10:changelog-hub-*` |
| **npm** | CLI wrapper | [@mohmk10/changelog-hub](https://www.npmjs.com/package/@mohmk10/changelog-hub) |
| **Docker Hub** | Container image | [devmohmk/changelog-hub](https://hub.docker.com/r/devmohmk/changelog-hub) |
| **VS Code** | Extension | [Marketplace](https://marketplace.visualstudio.com/items?itemName=mohmk10.changelog-hub) |
| **JetBrains** | Plugin | [Marketplace](https://plugins.jetbrains.com/plugin/29531-changelog-hub) |

---

## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## Author

**Mohamed Makan**

[![GitHub](https://img.shields.io/badge/GitHub-Mohmk10-181717?style=flat-square&logo=github)](https://github.com/Mohmk10)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mohamed_Makan-0a66c2?style=flat-square&logo=linkedin)](https://linkedin.com/in/mohamedmakan)

---

<p align="center">
  <sub>Built with love as part of the Changelog Hub ecosystem</sub>
</p>
