from pydantic import BaseModel

class BuyHeartsResponse(BaseModel):
    success: bool
    hearts: int
    gems: int
    message: str
