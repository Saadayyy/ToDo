# ToDo

## Kanban Board with Virtual Mouse Control

This project is a Kanban board that allows users to manage tasks visually using hand gestures and a virtual mouse. The virtual mouse is controlled using a webcam and hand gestures detected via Mediapipe. Github pages don't support the mouse so for full functionality run on local server.

## Features

- **Task Management**: Create, read, update, and delete tasks on the Kanban board.
- **Hand Gesture Control**: Use hand gestures to control the virtual mouse for interacting with the Kanban board.
- **Volume and Brightness Control**: Adjust system volume and brightness using specific hand gestures.
- **Scroll Control**: Scroll vertically and horizontally with pinch gestures.

## Technologies Used

- **Flask**: Web framework for the Kanban board.
- **OpenCV**: Image processing library to capture webcam feed.
- **Mediapipe**: Library for hand gesture recognition.
- **PyAutoGUI**: Library to control the mouse and keyboard.
- **Screen Brightness Control**: Library to control the screen brightness.
- **pycaw**: Library to control the system audio.

## Installation

### Prerequisites

- Python 3.7 or higher
- `pip` (Python package installer)

### Clone the Repository

```bash
git clone https://github.com/yourusername/kanban-virtual-mouse.git
cd kanban-virtual-mouse

### Create and Activate a Virtual Environment
-python -m venv venv
-source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

### install Dependencies
pip install -r requirements.txt

### run app
python app.py

