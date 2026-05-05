import yaml
import os
from templates import AGENT_CLIENT_TEMPLATE

OUTPUT_DIR = "./output"
DEFAULT_ENDPOINT = "https://maftests.services.ai.azure.com/api/projects/mafTestProject"


def load_yaml(path):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def generate_code(agent_yaml):
    agent_name = agent_yaml["name"]
    agent_version = agent_yaml["version"]

    code = AGENT_CLIENT_TEMPLATE.format(
        endpoint=DEFAULT_ENDPOINT,
        agent_name=agent_name,
        agent_version=agent_version,
    )

    filename = f"{agent_name}_client.py"
    filepath = os.path.join(OUTPUT_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(code)

    return filepath


def main():
    agent_yaml = load_yaml("./agents/doc_agent.yaml")
    filepath = generate_code(agent_yaml)
    print(f"Código gerado em: {filepath}")


if __name__ == "__main__":
    main()
