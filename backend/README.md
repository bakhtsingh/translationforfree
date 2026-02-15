# Translation API - FastAPI Web Application

A modern, scalable FastAPI-based translation service using Chipp AI. This application provides both a web interface and REST API for text translation.

## Features

- 🌐 **Web Interface**: User-friendly HTML interface for easy translation
- 🚀 **REST API**: Complete API with automatic documentation
- 🔧 **Configurable**: Environment-based configuration
- 📝 **Logging**: Comprehensive logging for monitoring and debugging
- 🛡️ **Error Handling**: Robust error handling and validation
- 🔄 **Async Support**: Built with async/await for better performance
- 📊 **Health Checks**: Built-in health monitoring endpoints

## Project Structure

```
translationforfree/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application
│   ├── config.py        # Configuration management
│   ├── models.py        # Pydantic models
│   └── services.py      # Translation service
├── main.py              # Application entry point
├── requirements.txt     # Python dependencies
├── config.env          # Environment configuration
└── README.md           # This file
```

## Quick Start

### 1. Install Dependencies

```bash
# Install required packages
pip install -r requirements.txt
```

### 2. Configure Environment

1. Copy the configuration template:
   ```bash
   cp config.env.template config.env
   ```

2. Edit `config.env` and add your actual API key:
   ```env
   API_KEY=your_actual_api_key_here
   ```

### 3. Run the Application

```bash
# Start the server
python main.py
```

The application will be available at:
- **Web Interface**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Usage

### Translate Text

**Endpoint**: `POST /translate`

**Request Body**:
```json
{
  "text": "Hello, world!",
  "source_language": "English",
  "target_language": "Telugu"
}
```

**Response**:
```json
{
  "success": true,
  "translated_text": "హలో, ప్రపంచం!",
  "source_language": "English",
  "target_language": "Telugu",
  "original_text": "Hello, world!"
}
```

### Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "message": "Translation API is running"
}
```

## Configuration

Edit `config.env` to customize the application:

```env
# API Configuration
API_KEY=your_api_key_here
CHIPP_BASE_URL=https://app.chipp.ai/api/v1/chat/completions
CHIPP_MODEL=translationforfree-10024994

# Server Configuration
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

## Development

### Running in Development Mode

```bash
# Enable debug mode in config.env
DEBUG=True

# Run with auto-reload
python main.py
```

### Production Deployment

1. Set `DEBUG=False` in `config.env`
2. Configure proper CORS origins
3. Use a production ASGI server like Gunicorn with Uvicorn workers

```bash
# Example production command
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Input validation using Pydantic
- **API Errors**: Proper handling of Chipp AI API responses
- **Network Errors**: Timeout and connection error handling
- **Server Errors**: Graceful error responses with logging

## Logging

The application logs important events:

- Translation requests and responses
- API errors and timeouts
- Server startup/shutdown events
- Health check requests

## Future Enhancements

This application is designed to be easily extensible. Consider adding:

- **Database Integration**: Store translation history
- **Authentication**: User management and API keys
- **Rate Limiting**: Prevent API abuse
- **Caching**: Cache frequent translations
- **Batch Translation**: Translate multiple texts at once
- **Language Detection**: Auto-detect source language
- **Translation Memory**: Reuse previous translations

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your API key is correctly set in `config.env`
2. **Port Already in Use**: Change the PORT in `config.env` or stop the conflicting service
3. **Import Errors**: Make sure all dependencies are installed with `pip install -r requirements.txt`

### Debug Mode

Enable debug mode in `config.env` for detailed logging and auto-reload during development.

## License

This project is for educational and development purposes.
