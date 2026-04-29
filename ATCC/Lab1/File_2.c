// Append one file at the end of the other.

#include<stdio.h>
void main(){

    FILE *fp,*fp2;
    fp=fopen("TryText2.txt","r");
    fp2=fopen("TryText.txt","a");
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
        putc(ch,fp2);
        ch=getc(fp);
    }
    fclose(fp);
    fclose(fp2);

}