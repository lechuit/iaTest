# MPC-Enhanced Audit Trails for Review Sheets

## Description

This project aims to implement a Model Context Protocol (MPC) to create rich, contextual audit logs for a system that manages review sheets. When a change is made to a review sheet (e.g., field update, attachment, deletion), an MPC component will capture not just *what* changed, but also allow for storing *context* around that change. This provides a more comprehensive understanding of the review process.

## Project Goals

*   **Context Capture:** Implement mechanisms for capturing contextual information when a change to a review sheet is initiated. This includes:
    *   User identification.
    *   Rationale for the change (e.g., free-text input or predefined reasons).
    *   Links to related discussions or task IDs, if applicable.
    *   (Future consideration) Snapshots of relevant data before the change.
*   **Context Storage:** Design and implement a method for storing this contextual information, ensuring it's linked to the specific version or change event of the review sheet.
*   **Context Retrieval:** Develop ways for users or AI agents to query the history of a review sheet along with the captured context for each change.
*   **Improved Transparency & Accountability:** Enhance the review process by providing clear insights into why changes were made.
*   **Foundation for Advanced Features:** Lay the groundwork for future capabilities like AI-assisted auditing or training AI models on decision-making processes.

## High-Level Design

### 1. System Architecture Overview
(Placeholder: "This section will describe the main components of the system, including the existing Review Sheet API, the MPC Context Service, and the Context Storage. A diagram may be added later.")

The MPC component will likely act as a service that interfaces with the existing private API. It might be a wrapper around the existing API, a parallel service that subscribes to events from the main API, or be called directly by the API when changes occur. The choice will depend on the existing system's architecture and extensibility.

### 2. MPC Component Interface
(Placeholder: "This section will define how other parts of the system interact with the MPC component.")

We anticipate at least two primary interactions:

*   **Logging a change:** An endpoint or function, tentatively named `log_change_context(change_details, context_data)`.
    *   `change_details`: This would include specifics like `sheet_id`, `field_changed` (e.g., "description", "assignee"), `old_value`, `new_value`, `event_type` (e.g., "UPDATE", "CREATE", "DELETE", "ATTACH").
    *   `context_data`: This would carry the contextual information, such as `user_id`, `rationale` (free-text or structured), `related_links` (e.g., to task management systems or discussion threads), and potentially `client_info` (e.g., UI version, IP address).
*   **Retrieving contextual history:** An endpoint or function, tentatively named `get_contextual_history(sheet_id, query_filters=None)`.
    *   `sheet_id`: The identifier for the review sheet whose history is being requested.
    *   `query_filters`: Optional parameters to filter the history (e.g., by date range, user, change type).

### 3. Context Storage
(Placeholder: "This section will detail the proposed method for storing the contextual audit information.")

Several options are being considered for storing the context logs:

*   **Option A: Extending Existing Database:** If the current Review Sheet API uses a relational database, we could add new tables (e.g., `context_log_entries`, `context_rationales`, `context_related_links`).
    *   *Pros:* Data consistency, potential for JOINs with existing data.
    *   *Cons:* Might require schema migrations for the existing system, potentially more rigid structure.
*   **Option B: Separate Log Files:** Store context as structured log files (e.g., JSON lines in append-only files, potentially one per sheet or aggregated).
    *   *Pros:* Simple to implement initially, good for high-volume writes.
    *   *Cons:* Difficult to query efficiently, harder to ensure data integrity and relationships.
*   **Option C: Dedicated Document Store/NoSQL Database:** Utilize a NoSQL database like MongoDB or Elasticsearch.
    *   *Pros:* Flexible schema suitable for varied and evolving context data, powerful querying capabilities (especially Elasticsearch for text search in rationales).
    *   *Cons:* Introduces another database technology to manage, potential data consistency challenges if not designed carefully with the main data store.

The choice will depend on factors like query complexity, expected data volume, scalability requirements, existing infrastructure, and team familiarity.

### 4. Data Models (Initial Thoughts)
(Placeholder: "This section will outline the basic structure of the data to be stored.")

A preliminary structure for a `ContextLogEntry` could be:

*   `log_id`: (Primary Key, e.g., UUID) - Uniquely identifies the log entry.
*   `sheet_id`: (Foreign Key or reference) - Links to the specific review sheet that was changed.
*   `version_id_before_change`: (Optional) - If the review sheet system is versioned, this could point to the version before this change.
*   `version_id_after_change`: (Optional) - Points to the version after this change.
*   `timestamp`: (ISO 8601 DateTime) - When the change was recorded by the MPC service.
*   `event_timestamp`: (ISO 8601 DateTime) - When the actual change event occurred in the source system (if different from `timestamp`).
*   `user_id`: (String or Integer) - Identifier for the user who initiated or is associated with the change.
*   `change_type`: (Enum or String, e.g., "FIELD_UPDATE", "ATTACHMENT_ADDED", "COMMENT_CREATED", "STATUS_CHANGED", "SHEET_DELETED") - Categorizes the type of modification.
*   `change_details`: (Object/JSONB) - A flexible field to store specific details of the change. Examples:
    *   For "FIELD_UPDATE": `{ "field_name": "description", "old_value": "...", "new_value": "..." }`
    *   For "ATTACHMENT_ADDED": `{ "attachment_id": "xyz123", "filename": "document.pdf" }`
*   `contextual_data`: (Object/JSONB) - Stores the MPC specific context.
    *   `rationale`: (Text) - The reason provided for the change.
    *   `related_links`: (Array of Objects) - e.g., `[{ "type": "JIRA_TICKET", "id": "PROJ-123", "url": "..." }, { "type": "DISCUSSION", "url": "..." }]`
    *   `source_application`: (String, Optional) - e.g., "ReviewSheetWebApp v2.1", "MobileClient v1.3"
    *   `additional_notes`: (Text) - Any other free-form contextual information.
*   `context_hash`: (String, Optional) - A hash of key contextual data to ensure integrity or detect tampering.

This model is an initial draft and will evolve as requirements are refined.

## Roadmap

### Version 0.1: Proof of Concept - Basic Context Logging

**Goal:** Implement the most basic end-to-end flow of capturing and storing a single piece of context (user-provided rationale) for a single, predefined type of change in a review sheet.

**Key Objectives:**

1.  **Targeted Change Event:**
    *   Identify one specific field in a review sheet (e.g., a 'status' field or a 'notes' field).
    *   Focus on capturing context when this specific field is updated via the existing API.

2.  **MPC Component - Minimal Viable Function:**
    *   Develop a simple function or endpoint (e.g., `log_rationale_for_update(sheet_id, field_name, new_value, user_id, rationale_text)`).
    *   This function will be manually called (or triggered by a simple hook if feasible) by the existing API when the targeted field is updated.

3.  **Contextual Input:**
    *   For this version, the only piece of context to capture will be a free-text "rationale" provided by the user making the change. The mechanism for how the user provides this rationale (e.g., an extra field in the API call, a separate prompt) will need to be considered, but the MPC component will simply expect it as input.

4.  **Context Storage - Simplest Approach:**
    *   Implement the most straightforward storage option outlined in the High-Level Design (e.g., a new `context_logs` table in the existing database or even simple structured local log files for this PoC).
    *   The table/log should store: `log_id`, `sheet_id`, `timestamp`, `user_id`, `changed_field`, `new_value`, `rationale_text`.

5.  **Basic Retrieval (Optional for v0.1, but desirable):**
    *   A very simple way to view the logged rationales, e.g., a function that prints logs for a given `sheet_id` to the console or returns them in a basic format.

**Out of Scope for v0.1:**
*   Complex UI for inputting rationale.
*   Capturing context for multiple types of changes (attachments, deletions, other fields).
*   Advanced context retrieval or querying.
*   Pre-change data snapshots.
*   Integration with external systems for related links.
*   Full automation of context capture triggers.

This version will serve as a foundational proof-of-concept to validate the core idea of logging contextual information alongside data changes.

## Getting Started

(Instructions on how to set up and run the project will be added here.)

## Contributing

(Guidelines for contributing to the project will be added here.)
