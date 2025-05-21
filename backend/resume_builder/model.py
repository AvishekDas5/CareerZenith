from transformers import BartForConditionalGeneration, BartTokenizer

model_name = "facebook/bart-large-cnn"
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)

def generate_summary(text, max_length=130, min_length=30, do_sample=False):
    inputs = tokenizer([text], max_length=1024, return_tensors="pt", truncation=True)
    summary_ids = model.generate(inputs["input_ids"], max_length=max_length, min_length=min_length, do_sample=do_sample)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# Example
text = "Your long article or input goes here..."
print(generate_summary(text))
