import fastapi

def register_routers(app: fastapi.FastAPI):
    from . import (
        item,
        data,
        manipulate,
    )

    app.include_router(item.router)
    app.include_router(data.router)
    app.include_router(manipulate.router)