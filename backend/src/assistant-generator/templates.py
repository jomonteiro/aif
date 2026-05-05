AGENT_CLIENT_TEMPLATE = """
# AUTO-GENERATED FILE - DO NOT EDIT

from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

endpoint = "{endpoint}"

project_client = AIProjectClient(
    endpoint=endpoint,
    credential=DefaultAzureCredential(),
)

AGENT_NAME = "{agent_name}"
AGENT_VERSION = "{agent_version}"

openai_client = project_client.get_openai_client(
    api_version="2024-05-01-preview"
)

def run_agent(user_input: str):
    response = openai_client.responses.create(
        input=[{{"role": "user", "content": user_input}}],
        extra_body={{
            "agent_reference": {{
                "name": AGENT_NAME,
                "version": AGENT_VERSION,
                "type": "agent_reference"
            }}
        }},
    )
    return response.output_text


if __name__ == "__main__":
    print(run_agent("Tell me what you can help with."))
"""
