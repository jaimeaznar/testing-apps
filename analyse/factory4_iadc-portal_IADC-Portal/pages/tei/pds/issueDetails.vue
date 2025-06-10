<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="80%"
      transition="dialog-bottom-transition"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-show="hasScreenDetailFields"
          small
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <label class="issue__key__text">{{ issue.key }}</label>
        </v-btn>
        <v-chip v-show="!hasScreenDetailFields" label>
          <strong>{{ issue.key }}</strong>
        </v-chip>
      </template>

      <v-card>
        <!-- Tittle -->
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            <div class="pa-2">
              <v-tooltip bottom color="default">
                <template #activator="{ on, attrs }">
                  <h5 v-bind="attrs" v-on="on">
                    <label
                      v-if="
                        screenFields && screenFields['Epic Link'] !== noneValue
                      "
                    >
                      {{ screenFields['Epic Link'] }} /
                    </label>
                    <v-avatar tile size="24px" color="primary">
                      <v-img
                        v-if="issue.fields.issuetype"
                        :src="issue.fields.issuetype.iconUrl"
                        :alt="issue.key"
                      />
                    </v-avatar>
                    {{ issue.key }}
                  </h5>
                </template>
                <v-spacer></v-spacer>
                <span>{{ issue.fields.issuetype.name }}</span>
              </v-tooltip>
            </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-tooltip bottom color="default">
              <template #activator="{ on, attrs }">
                <v-btn dark text v-bind="attrs" @click="shareUrl" v-on="on">
                  <v-icon right dark size="24px" title="Share">
                    mdi-share-variant
                  </v-icon>
                </v-btn>
              </template>
              <span>Share Issue</span>
            </v-tooltip>
            <v-tooltip bottom color="default">
              <template #activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  v-bind="attrs"
                  @click="dialog = false"
                  v-on="on"
                >
                  <v-icon right dark size="24px" title="Close">
                    mdi-close-box-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>Close Details</span>
            </v-tooltip>
          </v-toolbar-items>
        </v-toolbar>
        <!-- Body -->
        <!-- Top -->
        <v-banner class="pa-2" color="grey lighten-4">
          <h3 class="">{{ screenFields['Summary'] }}</h3>
        </v-banner>
        <v-row v-if="Object.keys(screenFields).length > 0">
          <!-- Left -->
          <v-col cols="8">
            <v-list dense>
              <v-list-item
                v-for="key in Object.keys(screenFields)"
                v-show="
                  !rightFields.includes(key.toLowerCase()) &&
                  !topFields.includes(key.toLowerCase()) &&
                  leftFields.includes(key.toLowerCase())
                "
                :key="key"
              >
                <v-list-item-content>
                  <v-list-item-title
                    ><strong class="field-tittle">{{
                      key
                    }}</strong></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <v-textarea
                      :value="extractTextFromJsonField(screenFields[key])"
                      max-height="50"
                      outlined
                      max-rows="3"
                      readonly
                      :class="
                        getJiraIssueDetailsClass(
                          extractTextFromJsonField(screenFields[key]),
                        )
                      "
                    ></v-textarea>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-for="key in Object.keys(screenFields)"
                v-show="
                  !rightFields.includes(key.toLowerCase()) &&
                  !topFields.includes(key.toLowerCase()) &&
                  !leftFields.includes(key.toLowerCase())
                "
                :key="key + 1"
              >
                <v-list-item-content>
                  <v-list-item-title
                    ><strong class="field-tittle">{{
                      key
                    }}</strong></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <pre
                      :class="
                        getJiraIssueDetailsClass(
                          extractTextFromJsonField(screenFields[key]),
                        )
                      "
                      >{{
                        removeLeadingTrailingSpacesAndCommas(
                          extractTextFromJsonField(screenFields[key]),
                        )
                      }}</pre
                    >
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <!-- Right -->
          <v-col cols="4">
            <v-chip :color="issueStatusColor" class="pa-3 ma-2" label>
              <h3>
                <label>
                  <strong class="field-title">{{
                    issue.fields.status.name.toUpperCase()
                  }}</strong>
                </label>
              </h3>
            </v-chip>

            <v-expansion-panels v-model="detailsPanel">
              <v-expansion-panel class="padded">
                <v-expansion-panel-header>
                  <h3>Details</h3>
                </v-expansion-panel-header>
                <v-divider></v-divider>
                <v-expansion-panel-content>
                  <v-list dense>
                    <!-- Start:  Static - Issue Type -->
                    <v-list-item>
                      <v-list-item-content>
                        <v-row align="center">
                          <v-col cols="4">
                            <v-list-item-title
                              ><strong class="field-tittle"
                                >Issue Type</strong
                              ></v-list-item-title
                            >
                          </v-col>
                          <v-col cols="8">
                            <v-list-item-subtitle>
                              <v-text-field
                                flat
                                solo
                                class="ma-0 pa-0 text-field"
                                hide-details
                                readonly
                                dense
                                :value="issue.fields.issuetype.name"
                              >
                              </v-text-field>
                            </v-list-item-subtitle>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                    <!-- End: Static - Issue Type -->
                    <v-list-item
                      v-for="key in Object.keys(screenFields)"
                      v-show="
                        rightFields.includes(key.toLowerCase()) &&
                        !topFields.includes(key.toLowerCase()) &&
                        !leftFields.includes(key.toLowerCase())
                      "
                      :key="key + 2"
                    >
                      <v-list-item-content>
                        <v-row align="center">
                          <v-col cols="4">
                            <v-list-item-title
                              ><strong class="field-tittle">{{
                                key
                              }}</strong></v-list-item-title
                            >
                          </v-col>
                          <v-col cols="8">
                            <v-list-item-subtitle>
                              <v-text-field
                                flat
                                solo
                                :class="[
                                  'ma-0 pa-0',
                                  getJiraIssueDetailsRightClass(
                                    extractTextFromJsonField(screenFields[key]),
                                  ),
                                ]"
                                hide-details
                                readonly
                                dense
                                multi-line
                                :value="
                                  removeLeadingTrailingSpacesAndCommas(
                                    extractTextFromJsonField(screenFields[key]),
                                  )
                                "
                              >
                              </v-text-field>
                            </v-list-item-subtitle>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <!-- Footer -->
        <v-banner></v-banner>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'nuxt-property-decorator';
import {
  Issue,
  Content,
  Doc,
  ScreenField,
} from '~/pages/tei/data/models/issue.model';
import { Project } from '~/pages/tei/data/models/project.model';
const NONE: string = `None`;

@Component({ layout: 'tei' })
export default class IssueDetails extends Vue {
  @Prop({ type: Object, required: true })
  issue!: Issue;

  @Prop({ type: Object, required: true })
  project!: Project;

  dialog = false;
  detailsPanel = [0, 1];
  selectServer = 'System JIRA';
  screenDetailFields = [];
  screenFields: ScreenField = {};
  leftFields = [
    'description',
    'acceptance criteria',
    'detailed design references',
    'linked issues',
    'details of failure consequence assessment',
    'additional verification or comments',
  ];

  rightFields = [
    'assignee',
    'reporter',
    'labels',
    'priority',
    'components',
    'epic link',
    'epic name',
    'fix versions',
    'sprint',
    'story points',
    'issue type',
    'start date',
    'end date',
    'due date',
  ];

  topFields = ['summary', 'status', 'issue type'];
  noneValue: string = NONE;

  @Inject() calculateIssueStatusColor!: (issue: Issue) => string;

  get descriptionText() {
    return this.extractTextFromJsonField(
      JSON.stringify(this.screenFields.Description),
    );
  }

  get hasScreenDetailFields() {
    return Object.keys(this.screenDetailFields || {}).length > 0;
  }

  get issueStatusColor() {
    return this.calculateIssueStatusColor(this.issue);
  }

  mounted() {
    this.getScreenDetailsFromApi();
  }

  getJiraIssueDetailsClass(fieldValue: string) {
    if (fieldValue === this.noneValue) {
      return 'jira-issue-details grey-text';
    }
    return 'jira-issue-details normal-text';
  }

  getJiraIssueDetailsRightClass(fieldValue: string) {
    if (fieldValue === this.noneValue) {
      return 'text-field grey-text';
    }
    return 'text-field normal-text';
  }

  shareUrl() {
    this.$emit('shareIssue', { value: this.issue.key });
  }

  removeLeadingTrailingSpacesAndCommas(str: string): string {
    return str.replace(/^[\s,]+|[\s,]+$/g, '');
  }

  formatList(content: any, indent: number = 0): string {
    let text = '';
    content.forEach((item: { type: string; content: any[] }) => {
      if (item.type === 'listItem') {
        const subContent = item.content.filter(
          (subItem: { type: string }) =>
            subItem.type === 'paragraph' || subItem.type === 'bulletList',
        );
        const subList = subContent.find(
          (subItem: { type: string }) => subItem.type === 'bulletList',
        );
        if (subList) {
          text += this.formatList(subList.content, indent + 2);
        } else {
          const itemText = this.extractTextFromTable(subContent);
          text += `${' '.repeat(indent)}- ${itemText}\n`;
        }
      }
    });
    return text;
  }

  extractTextFromTable(content: any): string {
    let text = '';
    content.forEach((item: { type: string; text: string; content: any }) => {
      if (item.type === 'text') {
        text += item.text;
      } else if (item.type === 'paragraph') {
        text += this.extractTextFromTable(item.content);
      }
    });
    return text;
  }

  formatJsonAsTable(json: any): string {
    if (!json || json.type !== 'table' || !json.content) {
      return '';
    }

    // Extract cells from the table
    const rows = json.content.filter(
      (row: { type: string }) => row.type === 'tableRow',
    );
    const cells = rows.map((row: { content: any[] }) =>
      row.content.filter((cell: { type: string }) => cell.type === 'tableCell'),
    );

    // Calculate the maximum width for each column
    const columnWidths = cells[0].map(() => 0);
    cells.forEach((row: any[]) => {
      row.forEach((cell: { content: any[] }, index: string | number) => {
        let cellText = '';
        cell.content.forEach((content: { type: string; content: any }) => {
          if (content.type === 'paragraph') {
            cellText += this.extractTextFromTable(content.content);
          } else if (content.type === 'bulletList') {
            cellText += this.formatList(content.content);
          }
        });
        columnWidths[index] = Math.max(columnWidths[index], cellText.length);
      });
    });

    // Generate the formatted table rows
    const formattedRows = rows.map((row: { content: any[] }) => {
      const formattedCells = row.content.map(
        (cell: { content: any[] }, index: string | number) => {
          let cellText = '';
          cell.content.forEach((content: { type: string; content: any }) => {
            if (content.type === 'paragraph') {
              cellText += this.extractTextFromTable(content.content);
            } else if (content.type === 'bulletList') {
              cellText += this.formatList(content.content);
            }
          });
          const padding = ' '.repeat(columnWidths[index] - cellText.length);
          return ` ${cellText}${padding} `;
        },
      );
      return `|${formattedCells.join('|')}|\n`;
    });

    // Generate the separator row
    const separatorRow = `+${columnWidths
      .map((width: number) => '-'.repeat(width + 2))
      .join('+')}+\n`;

    // Combine the rows into the final table
    return `${separatorRow}\n${formattedRows.join('\n')}\n${separatorRow}`;
  }

  extractText(json: Content[] | undefined, level: number = 0): string {
    let result = '';

    if (json) {
      for (const item of json) {
        if (item.type === 'bulletList' && item.content) {
          result += this.extractText(item.content, level);
        } else if (item.type === 'listItem' && item.content) {
          const indentation = '  '.repeat(level);
          result += `${indentation}${this.extractTextFromListItem(
            item.content,
            level + 1,
          )}`;
        } else if (item.type === 'paragraph' && item.content) {
          result += `${this.extractTextFromParagraph(item.content)}`;
        } else if (item.type === 'table') {
          result += this.formatJsonAsTable(item);
        } else if (item.type !== undefined) {
          result += this.extractText(item.content, level);
          result += this.extractText(item.marks, level);
        }
      }
    }
    return result;
  }

  extractTextFromListItem(content: Content[], level: number = 0): string {
    let result = '';

    for (const item of content) {
      if (item.type === 'paragraph' && item.content) {
        const indentation = level > 1 ? '  '.repeat(level) : '';
        result += `${indentation}- ${this.extractTextFromParagraph(
          item.content,
        )}\n`;
      } else if (item.type === 'bulletList' && item.content) {
        result += this.extractText(item.content, level + 1);
      }
    }

    return result;
  }

  extractTextFromParagraph(content: Content[]): string {
    let result = '';

    for (const item of content) {
      if (item.type === 'text' && item.text?.trim() !== '') {
        result += item.text;
      } else {
        if (item.type === 'hardBreak') {
          result += '\r\n';
        }
        const href = item.attrs?.href || item.attrs?.url;
        if (href) {
          result += `~ ${href}`;
        }
      }
    }

    return result.trim();
  }

  // Parse jsonFieldValue object
  flattenDoc(doc: Doc): string {
    const flattened: string[] = [];

    if (Array.isArray(doc.content)) {
      flattened.push(...doc.content.map((item) => this.extractText([item])));
    } else if (typeof doc.content === 'string') {
      flattened.push(doc.content);
    }

    return flattened.join('\n').replace(/,$/, '');
  }

  extractTextFromJsonField(jsonFieldValue: any): string {
    if (typeof jsonFieldValue === 'string') {
      return jsonFieldValue;
    }

    if (typeof jsonFieldValue === 'number') {
      return String(jsonFieldValue);
    }

    if (typeof jsonFieldValue !== 'object' || jsonFieldValue === null) {
      return '';
    }

    let text = '';
    let result = '';

    switch (true) {
      case Boolean(jsonFieldValue.name):
        if (text === '') {
          text += `${jsonFieldValue.name}`;
        } else {
          text += `, ${jsonFieldValue.name}`;
        }
        return text;

      case Boolean(jsonFieldValue.value):
        if (text === '') {
          text += `${jsonFieldValue.value}`;
        } else {
          text += `, ${jsonFieldValue.value}`;
        }
        return text;

      case Boolean(jsonFieldValue.displayName):
        return jsonFieldValue.displayName;

      case Boolean(jsonFieldValue.inwardIssue || jsonFieldValue.outwardIssue):
        if (jsonFieldValue.inwardIssue) {
          result += `- ${jsonFieldValue.type.inward}:  \r\n${jsonFieldValue.inwardIssue.key} \t ${jsonFieldValue.inwardIssue.fields.summary} \t ${jsonFieldValue.inwardIssue.fields.status.name}\r\n`;
        }
        if (jsonFieldValue.outwardIssue) {
          result += `- ${jsonFieldValue.type.outward}: \r\n${jsonFieldValue.outwardIssue.key} \t ${jsonFieldValue.outwardIssue.fields.summary} \t ${jsonFieldValue.outwardIssue.fields.status.name}\r\n`;
        }
        return result;

      case Array.isArray(jsonFieldValue):
        // Check if it's an array of inwardIssue or outwardIssue
        if (
          jsonFieldValue.every((item) => item.inwardIssue || item.outwardIssue)
        ) {
          // Join with '\n' if every item is inwardIssue or outwardIssue
          return jsonFieldValue
            .map((item: any) => this.extractTextFromJsonField(item))
            .join('');
        } else {
          // Join with ', ' if any item is not inwardIssue or outwardIssue
          return jsonFieldValue
            .map((item: any) => this.extractTextFromJsonField(item))
            .join(', ');
        }

      default:
        // jsonFieldValue is an object
        return this.flattenDoc(jsonFieldValue);
    }
  }

  private async getScreenDetailsFromApi() {
    if (this.project.key !== '') {
      try {
        const { data } = await this.$axios.get(
          `${(process.env.iadc as any).baseURLDocsApi}/screenDetails`,
          {
            params: {
              projectId: this.project.id,
              issueTypeId: this.issue.fields.issuetype.id,
            },
          },
        );
        this.screenDetailFields = data.screenDetails;
        if (
          this.screenDetailFields &&
          Object.keys(this.screenDetailFields).length > 0
        ) {
          this.createViewModel();
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.log(`Error = ${err}`);
      }
    }
  }

  private createViewModel() {
    if (this.screenDetailFields.length > 0) {
      this.screenDetailFields.forEach((field: { id: number; name: string }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (this.issue.fields?.hasOwnProperty(field.id.toString())) {
          const fieldValue = this.issue.fields[field.id.toString()];
          if (this.isNotEmpty(fieldValue)) {
            this.screenFields[field.name] = fieldValue;
          } else {
            this.screenFields[field.name] = this.noneValue;
          }
        } else {
          this.screenFields[field.name] = this.noneValue;
        }
      });
    }
  }

  private isNotEmpty(variable: any) {
    if (typeof variable === 'string') {
      return variable.trim() !== '';
    } else if (typeof variable === 'object') {
      if (Array.isArray(variable)) {
        return variable.length !== 0;
      } else {
        return Object.keys(variable).length !== 0;
      }
    }
    return true;
  }
}
</script>

<style lang="scss" scoped>
.italics {
  font-style: italic;
}
:deep(.v-expansion-panels) {
  padding: 1.5%;
}
.jira-issue-details {
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  padding: 2px;
  white-space: pre-wrap;
  transition: border-color 0.2s ease-in-out;
}

.normal-text {
  color: #333;
}

.grey-text,
:deep(.grey-text.v-input textarea),
:deep(.grey-text.v-text-field--solo
    > .v-input__control
    > .v-input__slot
    input) {
  color: #969898;
  white-space: pre-wrap;
}

.field-tittle {
  font-size: 14px;
}

.text-field {
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 400;
}

.jira-issue-details:hover {
  background-color: #fbfcfc;
}

.issue__key__text:hover {
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}
</style>
