from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import PIL.Image
import io
import os
import json
from flask import abort

app = Flask(__name__)
genai.configure(api_key="AIz")

# Usa un modelo con visión
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/ask", methods=["POST"])
def ask():
    prompt = request.form.get("message", "").strip()
    image_file = request.files.get("image")

    contexto_radiologia = (
        "Eres un asistente médico especializado en interpretación de radiografías. "
        "Tu función es analizar imágenes médicas, identificar patrones comunes (como lesiones óseas, infiltrados pulmonares, fracturas, etc.) "
        "y brindar observaciones clínicas útiles. No des diagnósticos definitivos, pero proporciona análisis preliminares y recomendaciones generales. "
        "Utiliza un lenguaje médico claro y preciso, ideal para personal de salud."
    )

    try:
        if not prompt and not image_file:
            return jsonify({"error": "Se requiere al menos un mensaje o una imagen."}), 400

        if image_file:
            image = PIL.Image.open(image_file.stream)
            if prompt:
                response = model.generate_content([contexto_radiologia, prompt, image])
            else:
                response = model.generate_content([contexto_radiologia, image])
        else:
            response = model.generate_content([contexto_radiologia, prompt])

        return jsonify({"response": response.text})

    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500


# Ruta para mostrar historial (dashboard simple)
@app.route('/dashboard')
def dashboard():
    # Lee JSON desde archivo
    json_path = os.path.join(app.root_path, 'data/people.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        paciente = json.load(f)
    
    return render_template('dashboard.html', paciente=paciente)
  
if __name__ == "__main__":
    app.run(debug=True)
