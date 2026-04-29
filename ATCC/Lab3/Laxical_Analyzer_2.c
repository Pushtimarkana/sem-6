#include <stdio.h>
#include <string.h>
#include <ctype.h>

void main() {
    FILE *fp1;
    fp1 = fopen("input_withoutComment.txt", "r");

    if (fp1 == NULL) {
        printf("File Not Found");
        return;
    }

    char ch, word[50];
    int index=0;

    char keywords[32][10] = {
        "auto","break","case","char","const","continue","default","do",
        "double","else","enum","extern","float","for","goto","if",
        "int","long","register","return","short","signed","sizeof","static",
        "struct","switch","typedef","union","unsigned","void","volatile","while"
    };

    int op = 0, ss = 0, cons = 0, keyword = 0, iden = 0;

    while ((ch = getc(fp1)) != EOF) {

        /* Ignore whitespace */
        if (isspace(ch))
            continue;

        /* Operators */
        if (ch == '+' || ch == '-' || ch == '*' || ch == '/' ||
            ch == '%' || ch == '<' || ch == '>') {
            op++;
        }

        /* Special Symbols */
        else if (ch == '(' || ch == ')' || ch == '{' || ch == '}' ||
                 ch == '[' || ch == ']' || ch == ';' || ch == ',' ||
                 ch == ':' || ch == '.') {
            ss++;
        }

        /* Numeric Constant */
        else if (isdigit(ch)) {
            while ((ch = getc(fp1)) != EOF && isdigit(ch));
            ungetc(ch, fp1);
            cons++;
        }

        /* Keyword or Identifier */
        else if (isalpha(ch) || ch == '_') {
            index = 0;
            word[index++] = ch;

            while ((ch = getc(fp1)) != EOF &&
                (isalnum(ch) || ch == '_')) {
                word[index++] = ch;
            }

            word[index] = '\0';
            ungetc(ch, fp1);

            int flag = 0;
            for (int i = 0; i < 32; i++) {
                if (strcmp(word, keywords[i]) == 0) {
                    flag = 1;
                    break;
                }
            }

            if (flag)
                keyword++;
            else
                iden++;
        }
    }

    fclose(fp1);

    printf("\nOperators        : %d", op);
    printf("\nSpecial Symbols  : %d", ss);
    printf("\nConstants        : %d", cons);
    printf("\nKeywords         : %d", keyword);
    printf("\nIdentifiers      : %d", iden);

    
}
