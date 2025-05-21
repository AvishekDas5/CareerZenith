import torch

def get_device():
    """
    Returns the available device: CUDA if available, else CPU.
    Also prints device details.
    """
    if torch.cuda.is_available():
        device_name = torch.cuda.get_device_name(0)
        print(f"✅ CUDA is available. Using GPU: {device_name}")
        return torch.device("cuda")
    else:
        print("⚠️ CUDA not available. Using CPU.")
        return torch.device("cpu")

get_device()