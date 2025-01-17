# Jellyfin-JWT-Video-Player

This project integrates **MinIO** with **JWT authentication** to provide a secure video streaming solution in a web application. It allows users to log in, stream videos directly from MinIO, and ensures secure access control using JWT tokens.

---

## Features

- **Secure Login**: Users must authenticate with a username and password to obtain a JWT token.
- **Video Streaming**: Stream videos directly from MinIO with byte-range support.
- **MinIO Integration**: Fetch and serve videos stored in MinIO buckets.
- **JWT Authentication**: Protect video endpoints by verifying JWT tokens.

---

## Technology Stack

- **Backend**: Node.js (Express, MinIO SDK, JSON Web Token)
- **Frontend**: HTML, JavaScript (Login and Video Player interfaces)
- **Storage**: MinIO

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/Jellyfin-JWT-Video-Player.git
   cd Jellyfin-JWT-Video-Player
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure MinIO and JWT:
   - Open `app.js` and update the following variables with your MinIO server details and JWT secret:
     ```javascript
     const minioClient = new Minio.Client({
       endPoint: 'your_minio_endpoint',
       port: your_minio_port,
       useSSL: false,
       accessKey: 'your_access_key',
       secretKey: 'your_secret_key'
     });

     const JWT_SECRET = 'your_jwt_secret_key';
     ```

4. Run the server:

   ```bash
   node app.js
   ```

5. Access the application:
   - Login page: `http://localhost:3000/login.html`
   - Video player: Redirected after successful login.

---

## Usage

1. Navigate to the login page and enter your credentials.
2. Upon successful login, a JWT token is generated and stored in the browser's local storage.
3. The video player page will fetch the token and include it in requests to stream videos.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Acknowledgments

This project leverages **MinIO** for storage and **JWT** for secure authentication, providing a robust and efficient video streaming solution.
