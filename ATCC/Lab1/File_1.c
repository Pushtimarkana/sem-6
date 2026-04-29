// Create open file and Countchars,spaces,tabs,words,line counts.

#include<stdio.h>
void main(){
    FILE *fp;
    fp = fopen("TryText.txt","r");

    if(fp==NULL){
        printf("File Not Found");
        return;
    }
    int cc=0,wc=0,sc=0,tc=0,lc=0,flag=0;
    // getc,fgetc,fscaf
    // char ch=getc(fp);
    // char ch=fgetc(fp);
    // fscanf(fp,%c,&ch)
    char ch= getc(fp);
   
    while (ch !=EOF)
    {
        cc++;
        if(ch==' '){
            sc++;
            if(flag==0){
                wc++;
                flag=1;
            }  
        }else if(ch=='\t'){
            if(flag==0){
                wc++;
                flag=1;
            }  
            tc++;
        }else if(ch=='\n'){
            if(flag==0){
                wc++;
                flag=1;
            }  
            lc++;
        }else{
            flag=0;
        }
        ch= getc(fp);
    }
    
    printf("%d  %d  %d  %d  %d",cc,sc,tc,lc,wc);
    fclose(fp);
    
}
