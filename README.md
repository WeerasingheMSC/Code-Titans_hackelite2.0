# AI_Interviews
This platform serves as an end-to-end solution by combining real-time AI interview simulation,career road map simulation and Career Readiness Assessment the  with a dedicated beginner support system, offering both practice and preparation in one place.

## 🤖 Introduction

Built with Next.js for the user interface and backend logic, Firebase for authentication and data storage, styled with TailwindCSS and using Vapi's voice agents, SkillSync is a website project designed to help you learn integrating AI models with your apps. The platform offers a sleek and modern experience for job interview preparation,Generate career roadmap and the Career Readiness Assessment.

## ⚙️ Tech Stack 

Next.js,
Firebase,
Tailwind CSS,
Vapi AI,
shadcn/ui,
Google Gemeni,
Zod,

## 🔋 Features

👉 Authentication: Sign Up and Sign In using password/email authentication handled by Firebase.

👉 Create Interviews: Easily generate job interviews with help of Vapi voice assistants and Google Gemini.

👉 Generate career roadmap: using user information google gemeni generate roadmap to dedicate user.

👉 Get feedback from AI: Take the interview with AI voice agent, and receive instant feedback based on your conversation.

👉 Modern UI/UX: A sleek and user-friendly interface designed for a great experience.

👉 Interview Page: Conduct AI-driven interviews with real-time feedback and detailed transcripts.

👉 Dashboard: Manage and track all your interviews with easy navigation.

👉 Responsiveness: Fully responsive design that works seamlessly across devices.

and many more, including code architecture and reusability

## 🤸 Quick Start

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- Git  
* Node.js  
+ npm (Node Package Manager)  

Cloning the Repository

[`https://github.com/WeerasingheMSC/Code-Titans_hackelite2.0.git`](url)  
`cd AI_interview` 

**Installation**

Install the project dependencies using npm:

`npm install`

**Set Up Environment Variables**

Create a new file named .env.local in the root of your project and add the following content:

`NEXT_PUBLIC_VAPI_WEB_TOKEN="da479ff8-767c-4147-8a50-a13d3d7dab2b"

NEXT_PUBLIC_VAPI_PUBLIC_KEY="da479ff8-767c-4147-8a50-a13d3d7dab2b"

NEXT_PUBLIC_VAPI_ASSISTANT_ID="645dcd47-9aa7-49b3-bc4d-f9f55c9ee6cb"

NEXT_PUBLIC_VAPI_INTERVIEW_ASSISTANT_ID="645dcd47-9aa7-49b3-bc4d-f9f55c9ee6cb"

NEXT_PUBLIC_VAPI_WORKFLOW_ID="645dcd47-9aa7-49b3-bc4d-f9f55c9ee6cb"

VAPI_PRIVATE_KEY= "9d4aa951-8838-4d68-ad63-294053fb5786"

GOOGLE_GENERATIVE_AI_API_KEY= "AIzaSyA2WqIecAxaDm9_PICF0Bggfm8oyr2fpoE"

NEXT_PUBLIC_BASE_URL= "https://ai-interviews-a0krqbk8o-sahan-champathi-weerasinghes-projects.vercel.app/"

NEXT_PUBLIC_FIREBASE_API_KEY= "AIzaSyBLvOdWT8hABw1FEBnslfq27FCSv2yOBR0"

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN= "ai-interviews-753c2.firebaseapp.com"

NEXT_PUBLIC_FIREBASE_PROJECT_ID= "ai-interviews-753c2"

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET= "ai-interviews-753c2.firebasestorage.app"

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= "627826867841"

NEXT_PUBLIC_FIREBASE_APP_ID= "1:627826867841:web:2206b32ff8f91014009780"

NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID= "G-TQXH6XBZ5L"

FIREBASE_PROJECT_ID= "ai-interviews-753c2"

FIREBASE_CLIENT_EMAIL= "firebase-adminsdk-fbsvc@ai-interviews-753c2.iam.gserviceaccount.com"

FIREBASE_PRIVATE_KEY= "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcr3axfrNxqSuK\neMXlD+EZGEejPJj0dmuzBckCCMQXQuitw3yWebhAno8RCQ/FAUud6bQR1W2mT3FO\nihJOmsctNxFlelONGGsaxRYdOwxM3u+c25ZH/G5DMMYhiwayPAPOGC6oo2Zl6wMl\nhszC8sa07c0r51iXBAdmzTkuj5J++4wtk6vmLsVemFnPFTDmAginhFTs8TmlfEYN\n4eaK945SO4CUwiRncpozguyQ8gi7XDro0yUJyPSadUVlev3cwqhV7GtxLbCzsi1i\nED18yehQLBnKtkVkerCbyuIJLqGwWQV0vRq98oU5F6328X4vUYbmgjpQlwxJFj2j\njTRKBBTRAgMBAAECggEAAVB4fKstKqwqXRY/xLjiIMGDIlOpDc3rf9wx0DZOHMrX\nJFQCOMnrGYGq/g/XJcYpwfiapdamPZGnh+rhFe828gJm/zSsPEAC7/3MvnCHHSL2\nnBh8dXyg2Sfw1Ymyw+58cq9hvtDmFD9JLringZAjShO/l5lwdQ3X2Q0qKGGUb0O+\nDZk9F9A4CKHkO5be9wtKsDx1wULGmbWxt2yaqKIZ3QGVVjbBg5l1Zs41BKf/waLX\nO1H5fj/j1ivRn3dmKOUJkl2D9kEkjtxQQ/ZqEU//LfFidzUE4bWWleInCIFM7Ilc\nT8MteWM9w0NsLkk/Mq45Nah2BD2jnBVjOoel0r9lcQKBgQDY9rOf8bQNzKOHWnb0\njDt3VXCSuDXfA/wnyVS7UzeU0IwCxxnc9iOFKl41g/f+O3rkky6F8wAdfIUaDfc9\nJ1JwdFpjXbwBREEe9gKNTV6SXBOBglzVZzyKLjvv2za0CMCepxZHGrsomJ2Hnv4x\n2Ne+BAVWqWRN8FEnjljTbbWd6QKBgQC44Fu1UR48tBnnxMfjNxSTK5cycfPhcq4j\nGiSWj0plQiWcZh6vWoEGPocrTEye++9eaKOpHOSB3x4EU24KYUs2pVerv5NM8gEf\nDrhXQPfaskp2tkDy2fuJ+jH3z4QCr37cU6bzCiUDrrXH8u87JFY2XxctImkuAMKc\n0LFcmhRmqQKBgCComgdEcc7189OnCWrsRPNEmCptsiY8ylMO2kNMVnx/G+Q7Jih9\noIEmDIJPuB+7wlbv1LvzBRxrJvnyCjpZVe55hTWZ4XfrV0Yaz+2HLOopFAKVpfW1\nkYZXSUxkmgplmuEG07KmUm/c8TF9/FNyiZ8fqdIOs3uL5htnMPW6ePEpAoGBAI3m\nNr2+m1TAb7nDAiFV34buSEjBygzatuneYQLmzJVX5gJbJ2Y0MyAV0i3bjFvix2FR\nM3zT3lgIZsOvPaDd+Jri4Z3Dl03R2iZ6Z+cgyJyliB4B2WwM/9JxpPSt5IcjKF34\nHwYgXTSsXn4v6oscYsesyN8tsElM8BLo45lN8iaxAoGAO76JXwYWjGOzAo21BRLJ\nqnbbafiroLRnjPkUn8CBoDIr0vhAGXq8vUlw3gFEjNqcdzT5zZj3JYg6SVoQwou6\nwiiQUwUOWJgbh6Baf0qbcHlv6PRcvxfeBFCYwrQcEFsjUi1b2C9qVvMz/sv+i+Qp\njIrRPj2139EpgGn+7SI93c8=\n-----END PRIVATE KEY-----\n"`


Running the Project

npm run dev
Open http://localhost:3000 in your browser to view the project.

**dont take too much interview becase we use vapi free version it offer limited call quantity**

you can also use Vesel URL for check the project

[https://ai-interviews-nhkx70r61-sahan-champathi-weerasinghes-projects.vercel.app](url)
