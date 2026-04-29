// Word No First Letter Capital

#include<stdio.h>
#include<ctype.h>
void main(){
    FILE *fp,*fp2;
    fp=fopen("TryText.txt","r");
    fp2=fopen("TryText3.txt","w");
    int newWord=1;
    char ch = getc(fp);
    if(fp==NULL){
        printf("File Not Found");
        return;
    }
    if(fp2==NULL){
        printf("File Not Found");
        return;
    }
    while(ch!= EOF){
        if(newWord && ch!=' ' && ch!='\t'&& ch!='\n' ){
            ch=toupper(ch);
            newWord=0;
        }
        putc(ch,fp2);
        if(ch==' ' || ch=='\n' || ch=='\t'){
            newWord=1;
        }
        ch=getc(fp);
    }
    fclose(fp);
    fclose(fp2);
}
