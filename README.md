# 🙏 ChurchConnect

Eine umfassende digitale Plattform zur Verwaltung von Kirchen und religiösen Gemeinschaften. ChurchConnect vereinfacht die Verwaltung von Mitgliedern, Veranstaltungen, Spenden, Diensten und Kommunikation innerhalb deiner Gemeinde.

## ✨ Hauptmerkmale

### 👥 Mitgliederverwaltung
- **Mitgliederverzeichnis**: Vollständige Datenbank mit Profilen, Rollen und Diensten
- **Personal & Führung**: Spezialisierte Verwaltung von Pastoren, Dienstleitern und Verwaltungspersonal
- **Aktivitätsstatus**: Verfolgung von aktiven, neuen und inaktiven Mitgliedern
- **Taufen**: Registrierung und Verfolgung von Taufen von Gemeindemitgliedern

### 📅 Veranstaltungen & Dienste
- **Veranstaltungskalender**: Planung und Verwaltung von Gottesdiensten, Retreats und Aktivitäten
- **Dienste**: Organisation von 6+ Diensten (Anbetung, Jugend, Mitarbeit, Kinder, Gastfreundschaft, Jüngerschaft)
- **Anwesenheitsverfolgung**: Kontrolle der Teilnahme an Veranstaltungen
- **Benachrichtigungen**: Benachrichtigungen über bevorstehende Veranstaltungen

### 💰 Finanzverwaltung
- **Spenden**: Registrierung und Verfolgung von Beiträgen
- **Fonds**: Verwaltung spezifischer Fonds (Allgemeine Opfer, Baufonds, Missionen, Wohlfahrt)
- **Berichte**: Analyse von Einnahmstrends und Sammelzielen
- **Finanz-Dashboard**: Visualisierung des Fondfortschritts

### 📱 Kommunikation
- **Echtzeit-Chat**: WhatsApp-ähnlicher Stil mit Unterstützung für Einzel- und Gruppengespräche
- **Sticker & Emojis**: Bereicherte Ausdrücke
- **Audio-/Videoanrufe**: Integration der direkten Kommunikation
- **Dateien & Anhänge**: Inhaltsfreigabe

### 📚 Inhalte & Ressourcen
- **Predigten**: Predigtbibliothek mit Audio und Transkriptionen
- **Dokumente**: Speicherung und Freigabe von Kirchendokumenten
- **Fotogalerie**: Alben von Veranstaltungen, Retreats und Gemeinschaftsmomenten
- **Flugblätter**: Design und Verbreitung von Veranstaltungsankündigungen

### 🙏 Gebet & Gemeinschaft
- **Gebetsanfragen**: Gebetsinterzession-Gemeinschaft
- **Gemeinschaft**: Gemeinschaftsforum und Unterstützung
- **Dringende Gebetsanfragen**: Kennzeichnung der Priorität für kritische Bedürfnisse

### ⚙️ Anpassung
- **Designs**: Helles/dunkles Design
- **Sprachen**: 10 unterstützte Sprachen (Englisch, Spanisch, Französisch, Portugiesisch, Italienisch, Deutsch, Niederländisch, Polnisch, Russisch, Japanisch)
- **Schnittstellendichte**: Kompakte, reguläre und komfortable Ansichten
- **Primärfarben**: 6 anpassbare Farbpaletten

## 🛠️ Tech Stack

### Frontend
- **React 18** - Interaktive Benutzeroberfläche
- **Vite** - Schnelle Build-Tool
- **CSS-Variablen** - Dynamische und zugängliche Designs
- **Context API** - Globale Zustandsverwaltung (Sprachen, Designs)

### Backend
- **Node.js + Express** - REST API
- **MongoDB** - NoSQL-Datenbank
- **JWT** - Authentifizierung und Autorisierung
- **Multer** - Upload-Handling

### Funktionalitäten
- **Authentifizierung**: Sichere Anmeldung mit Rollen
- **Autorisierung**: Rollenbasierte Zugriffskontrolle
- **Responsives Design**: Kompatibel mit Mobilgeräten und Desktop
- **Offline-Unterstützung**: Lokal zwischengespeicherte Daten

## 📋 Voraussetzungen

- Node.js 14+
- MongoDB 4.4+
- npm oder yarn

## 🚀 Installation

### 1. Repository klonen
```bash
git clone https://github.com/dein-benutzer/ChurchConnect.git
cd ChurchConnect
```

### 2. Abhängigkeiten installieren

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Umgebungsvariablen konfigurieren

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017/churchconnect
JWT_SECRET=dein_geheimer_schlüssel
PORT=5000
```

### 4. MongoDB starten
```bash
mongod
```

### 5. Anwendung ausführen

**Frontend (Entwicklung)**
```bash
npm run dev
```

**Backend**
```bash
cd backend
npm start
```

Die Anwendung ist verfügbar unter `http://localhost:5173`

## 📁 Projektstruktur

```
ChurchConnect/
├── src/
│   ├── pages/               # Hauptseiten
│   │   ├── Dashboard.jsx
│   │   ├── Members.jsx
│   │   ├── Staff.jsx
│   │   ├── Events.jsx
│   │   ├── Donations.jsx
│   │   ├── Reports.jsx
│   │   ├── ChatPage.jsx
│   │   ├── Gallery.jsx
│   │   ├── Flyers.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   ├── components/          # Wiederverwendbare Komponenten
│   │   ├── shell.jsx        # Seitenleiste, Topbar, Navigation
│   │   ├── ui.jsx           # Basis-UI-Komponenten
│   │   ├── icons.jsx        # Icon-System
│   │   ├── auth.jsx         # Login-Bildschirm
│   │   └── tweaks-panel.jsx # Anpassungsbereich
│   ├── contexts/            # Context API
│   │   └── LanguageContext.jsx
│   ├── hooks/               # Benutzerdefinierte Hooks
│   │   └── useTranslation.js
│   ├── data/                # Mock-Daten
│   │   └── index.js
│   ├── App.jsx              # Root-Komponente
│   └── main.jsx             # Einstiegspunkt
├── backend/
│   ├── models/              # MongoDB-Schemas
│   │   ├── Member.js
│   │   ├── Event.js
│   │   ├── Donation.js
│   │   └── ...
│   ├── routes/              # API-Endpunkte
│   │   ├── authRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── eventRoutes.js
│   │   └── ...
│   ├── middleware/          # Express-Middleware
│   │   ├── authMiddleware.js
│   │   └── ...
│   ├── config/              # Konfiguration
│   │   └── db.js
│   └── server.js            # Backend-Einstiegspunkt
├── public/                  # Statische Dateien
├── index.html               # HTML-Hauptdatei
└── package.json             # Abhängigkeiten
```

## 🔐 Rollen und Berechtigungen

ChurchConnect nutzt rollenbasierte Authentifizierung:

- **Admin**: Vollständiger Zugriff auf alle Funktionen
- **Pastor**: Verwaltung von Spirituellem, Veranstaltungen und Inhalten
- **Schatzmeister**: Verwaltung von Spenden und Finanzen
- **Dienstleiter**: Verwaltung des zugewiesenen Dienstes
- **Mitglied**: Zugriff auf öffentliche Inhalte und Kommunikation

## 🌍 Unterstützte Sprachen

🇩🇪 Deutsch | 🇺🇸 English | 🇪🇸 Español | 🇫🇷 Français | 🇵🇹 Português | 🇮🇹 Italiano | 🇳🇱 Nederlands | 🇵🇱 Polski | 🇷🇺 Русский | 🇯🇵 日本語

Ändere die Sprache unter Einstellungen > Sprachen

## 🎨 Anpassung

- **Designs**: Helles/dunkles Design
- **Farben**: 6 verfügbare Farbpaletten
- **Dichte**: Kompakt, regulär oder komfortabel
- **Einstellungsbereich**: Zugänglich in der unteren rechten Ecke (⚙️)

## 🤝 Beiträge

Beiträge sind willkommen. Bitte:

1. Forke das Projekt
2. Erstelle einen Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

## 🚀 Deployment

ChurchConnect läuft in der Produktion auf folgenden Plattformen:

### Frontend → Vercel
- **URL:** https://church-connect-xi.vercel.app
<img width="1919" height="1077" alt="image" src="https://github.com/user-attachments/assets/03024dc5-c946-4217-838e-7dd65b124004" />
<img width="1911" height="1070" alt="image" src="https://github.com/user-attachments/assets/9e76129d-99a7-477e-9088-4563be940a70" />

- **Framework:** Vite (React)
- **Auto-Deploy:** Bei jedem Push auf `main`

### Backend → Render
- **URL:** https://churchconnect-28f7.onrender.com
- **Laufzeit:** Node.js + Express
- **Datenbank:** MongoDB Atlas (Cloud)
- **Auto-Deploy:** Bei jedem Push auf `main`

> ⚠️ **Hinweis:** Der kostenlose Render-Plan schaltet den Server nach 15 Minuten Inaktivität ab. Die erste Anfrage kann bis zu 50 Sekunden dauern, bis der Server wieder "aufwacht".

### Umgebungsvariablen in der Produktion

**Vercel (Frontend):**

MIT-Lizenz. Siehe `LICENSE` für Details.

## 👨‍💻 Autor

**Rigo Erisk Reyes**  
📧 rigo.erick.reyes@gmail.com

## 🙏 Danksagungen

Mit Leidenschaft gebaut, um Glaubensgemeinden auf der ganzen Welt zu dienen.

---

**Gott segne deine Kirche!** 🙏
