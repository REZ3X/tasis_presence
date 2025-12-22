# TASIS - Presensi Piket Harian

Sistem presensi piket harian untuk anggota TASIS (Tata Tertib Siswa).

## Features

- ✅ **Authentication** dengan JWT (localStorage)
- 📸 **Camera Integration** untuk foto presensi
- 📍 **GPS Location** tracking
- ⏰ **Auto-detect** jenis piket berdasarkan waktu
- 🔐 **Role-based Access Control** (basic, staff, dev)
- 📱 **Mobile-first Design**
- 🗄️ **MongoDB** untuk database
- ☁️ **Google Drive** untuk penyimpanan gambar
- 📊 **Admin Panel** untuk staff dan dev

## User Roles

### Basic

- Input presensi piket
- Lihat riwayat presensi sendiri
- Tidak bisa akses admin panel

### Staff

- Semua akses Basic
- Akses admin panel (view only)
- Lihat data semua user
- Lihat semua presensi
- Tidak bisa edit/hapus data

### Dev

- Full access ke semua fitur
- Edit/hapus data presensi
- Edit user (role, password, dll)
- Lihat semua data

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_change_this_in_production
GOOGLE_SCRIPT_URL=your_google_apps_script_url_for_image_upload
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Create Initial Users

Edit `scripts/createUsers.js` to add your users, then run:

```bash
node scripts/createUsers.js
```

### 4. Setup Google Apps Script (for image upload)

Create a Google Apps Script with the following code:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const folder = DriveApp.getFolderById("YOUR_FOLDER_ID");

    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.data),
      data.mimeType,
      data.fileName
    );

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        url: file.getUrl(),
        id: file.getId(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Deploy it as a web app and copy the URL to `GOOGLE_SCRIPT_URL`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your mobile device or browser.

## Pages Structure

- `/` - Main page (presence input + history)
- `/login` - Login page
- `/profile` - User profile
- `/presence/[id]` - Presence detail
- `/admin` - Admin panel (staff & dev only)
- `/admin/user/[id]` - Edit user (dev only)

## MongoDB Collections

### users

```javascript
{
  _id: ObjectId,
  username: String,
  password: String, // hashed with bcryptjs
  name: String,
  class: String,
  major: String,
  role: String, // 'basic' | 'staff' | 'dev'
  createdAt: Date
}
```

### presences

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  username: String,
  picketType: String, // 'Piket Pagi' | 'Piket Sore'
  area: String, // Only for Piket Pagi
  timestamp: Date,
  location: {
    latitude: Number,
    longitude: Number
  },
  status: String, // 'Tepat Waktu' | 'Terlambat'
  lateNotes: String, // Only if late
  imageUrl: String, // Google Drive URL
  createdAt: Date
}
```

## Time Logic

### Piket Pagi

- **Default Time**: 04:00 - 06:55
- **Late if after**: 06:55
- **Requires**: Area selection

### Piket Sore

- **Default Time**: 12:30 - 18:00
- **Late if after**: 18:00
- **No area required**

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Presence

- `POST /api/presence/submit` - Submit presence
- `GET /api/presence/list` - Get presences list
- `GET /api/presence/[id]` - Get presence detail
- `PUT /api/presence/[id]` - Update presence (dev only)
- `DELETE /api/presence/[id]` - Delete presence (dev only)

### Users

- `GET /api/users/list` - Get users list (staff & dev)
- `GET /api/users/[id]` - Get user detail (staff & dev)
- `PUT /api/users/[id]` - Update user (dev only)

## Mobile-First Design

This app is optimized for mobile devices. When accessed from desktop (width > 1024px), it will show a warning to use mobile device.

## Tech Stack

- **Framework**: Next.js 16
- **Database**: MongoDB
- **Authentication**: JWT with localStorage
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **File Storage**: Google Drive
- **Image Handling**: HTML5 Camera API

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## Credits

Created by [rejaka.id](https://rejaka.id) for TASIS (Tata Tertib Siswa)

## License

Private - For TASIS internal use only

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
