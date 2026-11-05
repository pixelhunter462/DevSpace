# DevSpace Android APK project

Acesta este un proiect Android Studio care împachetează aplicația DevSpace într-o aplicație Android nativă de tip WebView. Nu este PWA și nu are nevoie de browser pentru a se deschide.

## Cum generezi APK-ul

1. Instalează Android Studio pe un PC.
2. Deschide Android Studio → **Open** și selectează folderul `DevSpace-Android-APK-Project`.
3. Așteaptă sincronizarea Gradle și instalarea componentelor Android necesare.
4. Din meniu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. APK-ul de test va fi creat de obicei în `app/build/outputs/apk/debug/app-debug.apk`.

## Instalare pe telefon

Transferă `app-debug.apk` pe telefonul Android și deschide-l pentru instalare. Android poate cere confirmarea permisiunii de instalare pentru sursa folosită.

## Detalii

- Nume: DevSpace
- ID aplicație: `com.devspace.toolkit`
- Versiune: 1.1.0
- Android minim: Android 7.0 (API 24)
- Instrumentele web sunt incluse local în APK și se deschid fără conexiune la internet.
- Unele funcții externe, dacă sunt adăugate ulterior, pot necesita internet.

Notă: arhiva conține proiectul-sursă Android Studio, nu un APK deja compilat. Compilarea necesită Android SDK și Gradle, care se instalează prin Android Studio.
