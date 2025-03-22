from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import torch
from transformers import AutoTokenizer, AutoModel

app = FastAPI(title="TransHLA API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PeptideRequest(BaseModel):
    sequences: List[str]
    hla_class: int  # 1 or 2 for HLA class I or II

class PeptideResponse(BaseModel):
    peptide: str
    probability: float
    is_epitope: bool

def pad_sequences(sequences: List[List[int]], target_length: int) -> List[List[int]]:
    """Pad sequences to target length"""
    for seq in sequences:
        padding_length = target_length - len(seq)
        if padding_length > 0:
            seq.extend([1] * padding_length)
    return sequences

class TransHLAPredictor:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained("facebook/esm2_t33_650M_UR50D")
        
        # Load both models
        self.model_I = AutoModel.from_pretrained("SkywalkerLu/TransHLA_I", trust_remote_code=True)
        self.model_II = AutoModel.from_pretrained("SkywalkerLu/TransHLA_II", trust_remote_code=True)
        
        self.model_I.to(self.device)
        self.model_II.to(self.device)
        
        self.model_I.eval()
        self.model_II.eval()

    def predict(self, sequences: List[str], hla_class: int) -> List[PeptideResponse]:
        try:
            # Choose model and padding length based on HLA class
            model = self.model_I if hla_class == 1 else self.model_II
            target_length = 16 if hla_class == 1 else 23

            # Tokenize sequences
            peptide_encoding = self.tokenizer(sequences)['input_ids']
            padded_encoding = pad_sequences(peptide_encoding, target_length)
            
            # Convert to tensor and move to device
            input_tensor = torch.tensor(padded_encoding).to(self.device)
            
            # Get predictions
            with torch.no_grad():
                outputs, _ = model(input_tensor)
            
            # Process results
            probabilities = torch.sigmoid(outputs).cpu().numpy()
            predictions = (probabilities >= 0.5).astype(int)
            
            # Format response
            results = []
            for seq, prob, pred in zip(sequences, probabilities, predictions):
                results.append(PeptideResponse(
                    peptide=seq,
                    probability=float(prob),
                    is_epitope=bool(pred)
                ))
            
            return results

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# Initialize predictor
predictor = TransHLAPredictor()

@app.get("/")
async def root():
    return {"message": "Welcome to TransHLA API"}

@app.post("/predict", response_model=List[PeptideResponse])
async def predict_epitopes(request: PeptideRequest):
    """
    Predict epitopes for given peptide sequences
    """
    # Validate HLA class
    if request.hla_class not in [1, 2]:
        raise HTTPException(status_code=400, detail="HLA class must be either 1 or 2")
    
    # Validate sequence lengths based on HLA class
    for seq in request.sequences:
        length = len(seq)
        if request.hla_class == 1 and not (8 <= length <= 14):
            raise HTTPException(
                status_code=400, 
                detail="HLA class I sequences must be between 8 and 14 amino acids"
            )
        elif request.hla_class == 2 and not (13 <= length <= 21):
            raise HTTPException(
                status_code=400, 
                detail="HLA class II sequences must be between 13 and 21 amino acids"
            )

    return predictor.predict(request.sequences, request.hla_class) 