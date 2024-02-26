# Installation
## create venv
```shell
python -m venv .venv
```

## activate venv

### Windows

Cmd activate
```shell
.venv\Scripts\activate
```
PowerShell activate
```shell
.venv\Scripts\activate.ps1
```
### Linux
```shell
source .venv\bin\activate
```

## Installation requirements

```shell
pip install -r server\requirements.txt
```

# Run server
```shell
uvicorn server.main:app
```