# StudIQ Privacy Notice

## Who This Is For

StudIQ provides learning activities for grades 5–9. A parent or guardian should supervise a child's use.

## Guest Use

- Sign-in is optional. Guest activity does not require a child's name, email, school, or other identifying details.
- Guest progress and the latest 100 generated activity labels per activity are stored in that browser's local storage.
- Chat messages are held only in the current page session and are not saved as a progress report.

## Optional Guardian Google Sign-In

- Google sign-in is intended for a parent or guardian, not for a child to create an account.
- Google and Firebase Authentication process the guardian's Google account information. StudIQ does not copy the guardian's email address into its Firestore progress documents.
- When signed in, the Firebase user ID is used to scope the guardian's progress and recent activity labels in Firestore. These documents contain learning totals, explored topics, selected grade, recent generated activity labels, and the most recent quiz result.
- Firestore access is restricted by `firestore.rules` to the authenticated account that owns the document. Review and publish those rules in your Firebase project before enabling sign-in.
- Signing in merges existing guest progress and recent labels from that browser into the guardian's account.
- Reset Progress clears the current progress report. Guardian account deletion and any associated Firebase Auth data must be managed by the project operator in Firebase.

## Gemini API Usage

- Chat messages are sent to Google's Gemini API from the backend when Gemini is configured; chat behavior is otherwise unchanged.
- Maths, science, English practice, general knowledge quiz, brain gym, and story requests send the selected grade, language, activity type, and recent activity labels to the backend for generation. The Gemini API key stays on the backend.
- No Google account email or Firebase user ID is sent to Gemini by the learning activity request.
- Google processes API requests under its applicable terms and data policies. Do not enter personal information into chat or learning activities.
- Gemini usage has separate quotas and possible costs from Firebase.

## Data Controls

- Guests can reset the progress report in the app's Progress page or Settings.
- Signed-in guardians can reset their Firestore progress report in the app. The separate recent-label history is retained to help avoid repeated content.
- The project operator is responsible for Firebase project configuration, security rules, retention, and account deletion.

## Safety

- StudIQ identifies itself as an AI learning companion.
- Generated material is requested to be child-appropriate and checked by application-level validation; automated checks cannot guarantee every response is suitable. A parent or guardian should supervise.
- Unsafe requests should receive a safe refusal response. Children should talk to trusted adults about serious concerns.
