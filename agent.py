from openai import OpenAI
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

_USE_COLOR = sys.stdout.isatty() and os.getenv("NO_COLOR") is None
_REASONING_COLOR = "\033[90m" if _USE_COLOR else ""
_RESET_COLOR = "\033[0m" if _USE_COLOR else ""

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("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"),
)

def generate_file_content(prompt: str) -> str:
    completion = client.chat.completions.create(
        model="z-ai/glm-5.2",
        messages=[
            {"role": "system", "content": "Ти агент, який створює файли за описом користувача. Відповідай тільки вмістом файлу, без пояснень."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        top_p=1,
        max_tokens=16384,
        seed=42,
        stream=True
    )

    content = ""
    for chunk in completion:
        if not getattr(chunk, "choices", None):
            continue
        if len(chunk.choices) == 0 or getattr(chunk.choices[0], "delta", None) is None:
            continue
        delta = chunk.choices[0].delta
        if getattr(delta, "content", None) is not None:
            part = delta.content
            content += part
            print(part, end="", flush=True)
    print()  # newline after streaming
    return content

def main():
    if len(sys.argv) < 3:
        print("Використання: python agent.py <filename> '<опис файлу>'")
        print("Приклад: python agent.py index.html 'Створи базову HTML-сторінку з заголовком і абзацом'")
        sys.exit(1)

    filename = sys.argv[1]
    description = sys.argv[2]

    print(f"{_REASONING_COLOR}Генерую вміст для {filename}...{_RESET_COLOR}")
    content = generate_file_content(description)

    path = Path(filename)
    path.write_text(content, encoding="utf-8")
    print(f"{_REASONING_COLOR}Файл {filename} створено.{_RESET_COLOR}")

if __name__ == "__main__":
    main()