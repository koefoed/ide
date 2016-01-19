require('isdals')
data(fev)

# Rename and convert height to cm
require('plyr')
fev <- rename(fev, c(Ht='Height'))
fev$Height <- cm(fev$Height)

# Interlude: Do the pca before codes are made into factors
pca <- prcomp(fev)
summary(pca)
plot(pca)
biplot(pca)


ggplot(data=pca, aes(x=x[,1], y=))


# Fixup the coding
fev$Gender <- as.factor( ifelse(fev$Gender==0, 'Female', 'Male') )
fev$Smoke  <- as.factor( ifelse(fev$Smoke==0, 'no', 'yes') )

summary(fev)

#write.csv(fev, 'fev.csv', row.names=F)


require('ggplot2')
ggplot(data=fev, aes(x=Age, y=FEV, colour=Smoke)) + geom_point() + geom_smooth()
#ggsave('fev_on_age.png', plot + theme(text=element_text(size=fontsize)), width=21.0, height=29.7, units='cm')
ggsave('fev_on_age.png', width=13.0, height=10, units='cm')

ggplot(data=fev, aes(x=Age, y=FEV, colour=Smoke)) + geom_point() + geom_smooth(method=lm)