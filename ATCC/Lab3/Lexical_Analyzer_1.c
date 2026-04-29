#include<stdio.h>
void main(){
    FILE *fp1,*fp2;
    fp1 = fopen("input.txt","r");
    fp2=fopen("input_withoutComment.txt","w");
    if(fp1==NULL){
        printf("File 1 Not Found");
        return;
    }
    if(fp2==NULL){
        printf("File 2 Not Found");
        return;
    }
    char ch,p;
    while(((ch=fgetc(fp1)) !=EOF)){
        if(ch=='/'){
            ch=fgetc(fp1);
            if(ch=='/'){
                do{
                    ch=fgetc(fp1);
                }while(ch!='\n');
                printf("\nSingle Line Comment is ignored\n");
            }
            else if(ch=='*'){
                do{
                    p=ch;
                    ch=fgetc(fp1);
                }while(p!='*' || ch!='/');
                printf("\nMulti line comment is ignored\n");
            }
            else{
                ungetc(ch,fp1);
                fputc('/',fp2);

            }
        }else{    
            fputc(ch,fp2);
        }
    }


}